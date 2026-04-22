import { existsSync } from "node:fs";

import {
  buildPublicContractsSnapshot,
  formatSnapshot,
  readSnapshotFile,
  snapshotFilePath,
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

const compareSnapshots = (): number => {
  if (!existsSync(snapshotFilePath)) {
    console.error(
      `Contract snapshot not found at ${snapshotFilePath}. Run pnpm contracts:generate first.`,
    );
    return 1;
  }

  const current = buildPublicContractsSnapshot();
  const previous = readSnapshotFile();

  if (current.undocumentedRoutes.length > 0) {
    console.error("Found undocumented runtime routes:");

    for (const route of current.undocumentedRoutes) {
      console.error(`- ${route.method} ${route.path}`);
    }

    return 1;
  }

  if (current.missingRuntimeRoutes.length > 0) {
    console.error("Found contract routes missing in runtime router registrations:");

    for (const route of current.missingRuntimeRoutes) {
      console.error(`- ${route.method} ${route.path}`);
    }

    return 1;
  }

  const currentSerialized = formatSnapshot(current);
  const previousSerialized = formatSnapshot(previous);

  if (currentSerialized === previousSerialized) {
    console.log("Contract snapshot is up to date.");
    return 0;
  }

  const previousByKey = new Map(
    previous.endpoints.map((endpoint) => [
      `${endpoint.method} ${endpoint.path}`,
      endpoint,
    ]),
  );
  const currentByKey = new Map(
    current.endpoints.map((endpoint) => [`${endpoint.method} ${endpoint.path}`, endpoint]),
  );

  const changedEndpoints: string[] = [];
  const removedFieldMessages: string[] = [];

  for (const [endpointKey, previousEndpoint] of previousByKey.entries()) {
    const currentEndpoint = currentByKey.get(endpointKey);

    if (!currentEndpoint) {
      changedEndpoints.push(endpointKey);
      continue;
    }

    if (JSON.stringify(previousEndpoint) !== JSON.stringify(currentEndpoint)) {
      changedEndpoints.push(endpointKey);
    }

    const schemaPairs: Array<{ name: string; before: JsonValue; after: JsonValue }> = [
      {
        name: "request.params",
        before: previousEndpoint.request.params,
        after: currentEndpoint.request.params,
      },
      {
        name: "request.query",
        before: previousEndpoint.request.query,
        after: currentEndpoint.request.query,
      },
      {
        name: "request.body",
        before: previousEndpoint.request.body,
        after: currentEndpoint.request.body,
      },
      {
        name: "responses.success",
        before: previousEndpoint.responses.success.schema,
        after: currentEndpoint.responses.success.schema,
      },
    ];

    for (let index = 0; index < previousEndpoint.responses.errors.length; index += 1) {
      const previousErrorSchema = previousEndpoint.responses.errors[index]?.schema;
      const currentErrorSchema = currentEndpoint.responses.errors[index]?.schema;

      if (!previousErrorSchema || !currentErrorSchema) {
        continue;
      }

      schemaPairs.push({
        name: `responses.errors[${index}]`,
        before: previousErrorSchema,
        after: currentErrorSchema,
      });
    }

    for (const pair of schemaPairs) {
      const previousFields = collectPropertyPaths(pair.before);
      const currentFields = collectPropertyPaths(pair.after);

      for (const fieldPath of previousFields) {
        if (!currentFields.has(fieldPath)) {
          removedFieldMessages.push(
            `${endpointKey} removed field ${pair.name}.${fieldPath}`,
          );
        }
      }
    }
  }

  const addedEndpoints = Array.from(currentByKey.keys()).filter(
    (key) => !previousByKey.has(key),
  );

  console.error("Contract drift detected.");

  if (addedEndpoints.length > 0) {
    console.error("Added endpoints:");

    for (const endpoint of addedEndpoints) {
      console.error(`- ${endpoint}`);
    }
  }

  if (changedEndpoints.length > 0) {
    console.error("Changed endpoint request/response shape:");

    for (const endpoint of changedEndpoints) {
      console.error(`- ${endpoint}`);
    }
  }

  if (removedFieldMessages.length > 0) {
    console.error("Removed public fields:");

    for (const message of removedFieldMessages) {
      console.error(`- ${message}`);
    }
  }

  console.error("Run pnpm contracts:generate and commit the updated snapshot.");
  return 1;
};

process.exit(compareSnapshots());
