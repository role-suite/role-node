import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

import {
  snapshotFilePath,
  type PublicContractsSnapshot,
} from "./public-contract-utils.js";

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
type JsonObject = { [key: string]: JsonValue };

const collectPropertyPaths = (
  schema: JsonValue,
  basePath = "",
): Set<string> => {
  const paths = new Set<string>();

  if (!schema || typeof schema !== "object") {
    return paths;
  }

  if (Array.isArray(schema)) {
    for (const item of schema) {
      for (const path of collectPropertyPaths(item, basePath)) {
        paths.add(path);
      }
    }

    return paths;
  }

  const objectSchema = schema as JsonObject;
  const properties = objectSchema.properties;

  if (properties && typeof properties === "object" && !Array.isArray(properties)) {
    for (const [key, childSchema] of Object.entries(properties)) {
      const propertyPath = basePath ? `${basePath}.${key}` : key;
      paths.add(propertyPath);

      for (const nested of collectPropertyPaths(childSchema, propertyPath)) {
        paths.add(nested);
      }
    }
  }

  const combinators = ["allOf", "anyOf", "oneOf"] as const;

  for (const combinator of combinators) {
    const value = objectSchema[combinator];

    if (Array.isArray(value)) {
      for (const item of value) {
        for (const nested of collectPropertyPaths(item, basePath)) {
          paths.add(nested);
        }
      }
    }
  }

  if (objectSchema.items) {
    for (const nested of collectPropertyPaths(objectSchema.items, `${basePath}[]`)) {
      paths.add(nested);
    }
  }

  return paths;
};

const collectRequiredPaths = (
  schema: JsonValue,
  basePath = "",
): Set<string> => {
  const required = new Set<string>();

  if (!schema || typeof schema !== "object") {
    return required;
  }

  if (Array.isArray(schema)) {
    for (const item of schema) {
      for (const path of collectRequiredPaths(item, basePath)) {
        required.add(path);
      }
    }

    return required;
  }

  const objectSchema = schema as JsonObject;
  const properties = objectSchema.properties;
  const requiredArray = objectSchema.required;

  if (
    properties &&
    typeof properties === "object" &&
    !Array.isArray(properties) &&
    Array.isArray(requiredArray)
  ) {
    for (const field of requiredArray) {
      if (typeof field !== "string") {
        continue;
      }

      const fieldPath = basePath ? `${basePath}.${field}` : field;
      required.add(fieldPath);
      const child = (properties as JsonObject)[field];

      for (const nested of collectRequiredPaths(child, fieldPath)) {
        required.add(nested);
      }
    }
  }

  if (objectSchema.items) {
    for (const path of collectRequiredPaths(objectSchema.items, `${basePath}[]`)) {
      required.add(path);
    }
  }

  const combinators = ["allOf", "anyOf", "oneOf"] as const;

  for (const combinator of combinators) {
    const value = objectSchema[combinator];

    if (Array.isArray(value)) {
      for (const item of value) {
        for (const path of collectRequiredPaths(item, basePath)) {
          required.add(path);
        }
      }
    }
  }

  return required;
};

const resolveBaseRefCandidates = (): string[] => {
  const envRef = process.env.CONTRACT_BASE_REF?.trim();

  return [envRef, "origin/main", "HEAD~1"].filter(
    (value): value is string => Boolean(value && value.length > 0),
  );
};

const parseCurrentSnapshot = (): PublicContractsSnapshot => {
  if (!existsSync(snapshotFilePath)) {
    throw new Error(
      `Contract snapshot not found at ${snapshotFilePath}. Run pnpm contracts:generate first.`,
    );
  }

  return JSON.parse(readFileSync(snapshotFilePath, "utf8")) as PublicContractsSnapshot;
};

const parseBaseSnapshot = (baseRef: string): PublicContractsSnapshot => {
  const command = `git show ${baseRef}:contracts/generated/public-api.snapshot.json`;
  const raw = execSync(command, { encoding: "utf8" });
  return JSON.parse(raw) as PublicContractsSnapshot;
};

const main = (): number => {
  let previous: PublicContractsSnapshot | null = null;
  let selectedBaseRef: string | null = null;

  for (const candidate of resolveBaseRefCandidates()) {
    try {
      previous = parseBaseSnapshot(candidate);
      selectedBaseRef = candidate;
      break;
    } catch {
      continue;
    }
  }

  if (!previous || !selectedBaseRef) {
    console.log(
      "Skipping breaking-change check: could not read a base snapshot from configured refs.",
    );
    return 0;
  }

  const current = parseCurrentSnapshot();

  const previousByKey = new Map(
    previous.endpoints.map((endpoint) => [
      `${endpoint.method} ${endpoint.path}`,
      endpoint,
    ]),
  );
  const currentByKey = new Map(
    current.endpoints.map((endpoint) => [`${endpoint.method} ${endpoint.path}`, endpoint]),
  );

  const removedEndpoints: string[] = [];
  const changedSuccessStatuses: string[] = [];
  const removedResponseFields: string[] = [];
  const addedRequiredRequestFields: string[] = [];

  for (const [key, previousEndpoint] of previousByKey.entries()) {
    const currentEndpoint = currentByKey.get(key);

    if (!currentEndpoint) {
      removedEndpoints.push(key);
      continue;
    }

    if (previousEndpoint.responses.success.status !== currentEndpoint.responses.success.status) {
      changedSuccessStatuses.push(
        `${key} success status ${previousEndpoint.responses.success.status} -> ${currentEndpoint.responses.success.status}`,
      );
    }

    const beforeResponseFields = collectPropertyPaths(
      previousEndpoint.responses.success.schema,
    );
    const afterResponseFields = collectPropertyPaths(
      currentEndpoint.responses.success.schema,
    );

    for (const field of beforeResponseFields) {
      if (!afterResponseFields.has(field)) {
        removedResponseFields.push(`${key} removed response field ${field}`);
      }
    }

    const requestParts = ["params", "query", "body"] as const;

    for (const part of requestParts) {
      const beforeRequired = collectRequiredPaths(previousEndpoint.request[part]);
      const afterRequired = collectRequiredPaths(currentEndpoint.request[part]);

      for (const field of afterRequired) {
        if (!beforeRequired.has(field)) {
          addedRequiredRequestFields.push(
            `${key} added required request.${part} field ${field}`,
          );
        }
      }
    }
  }

  const incompatible = [
    ...removedEndpoints,
    ...changedSuccessStatuses,
    ...removedResponseFields,
    ...addedRequiredRequestFields,
  ];

  if (incompatible.length === 0) {
    console.log(
      `No incompatible contract changes detected against ${selectedBaseRef}.`,
    );
    return 0;
  }

  console.error("Incompatible contract changes detected:");

  for (const issue of incompatible) {
    console.error(`- ${issue}`);
  }

  return 1;
};

process.exit(main());
