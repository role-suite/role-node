import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

import { allContracts, type EndpointContract } from "../../contracts/index.js";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type OpenApiSchema = {
  openapi: "3.1.0";
  info: {
    title: string;
    version: string;
  };
  tags: Array<{ name: string }>;
  paths: Record<string, Record<string, OpenApiOperation>>;
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http";
        scheme: "bearer";
        bearerFormat: "JWT";
      };
    };
  };
};

type OpenApiOperation = {
  operationId: string;
  tags: string[];
  security?: Array<Record<string, string[]>>;
  parameters?: OpenApiParameter[];
  requestBody?: {
    required: boolean;
    content: {
      "application/json": {
        schema: JsonValue;
      };
    };
  };
  responses: Record<string, OpenApiResponse>;
};

type OpenApiParameter = {
  name: string;
  in: "path" | "query";
  required: boolean;
  schema: JsonValue;
};

type OpenApiResponse = {
  description: string;
  content: {
    "application/json": {
      schema: JsonValue;
    };
  };
};

type JsonObject = { [key: string]: JsonValue };

const METHOD_ORDER: EndpointContract["method"][] = [
  "GET",
  "POST",
  "PATCH",
  "DELETE",
];

const toOpenApiPath = (pathValue: string): string => {
  return pathValue.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
};

const toJsonSchema = (schema: z.ZodTypeAny): JsonValue => {
  return z.toJSONSchema(schema, {
    io: "input",
    unrepresentable: "any",
  }) as JsonValue;
};

const toCamelCase = (value: string): string => {
  const words = value
    .split(/[^A-Za-z0-9]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return "";
  }

  return words
    .map((word, index) => {
      const head = word[0]?.toUpperCase() ?? "";
      const tail = word.slice(1);

      if (index === 0) {
        return `${head.toLowerCase()}${tail}`;
      }

      return `${head}${tail}`;
    })
    .join("");
};

const toOperationId = (contract: EndpointContract): string => {
  const methodPrefix = contract.method.toLowerCase();
  const segments = contract.path.split("/").filter((segment) => segment.length > 0);

  const parts = segments.map((segment) => {
    if (segment.startsWith(":")) {
      return `by-${segment.slice(1)}`;
    }

    return segment;
  });

  return toCamelCase(`${methodPrefix}-${parts.join("-")}`);
};

const toTag = (pathValue: string): string => {
  if (pathValue.startsWith("/api/auth")) {
    return "auth";
  }

  if (pathValue.includes("/import-export")) {
    return "import-export";
  }

  if (pathValue.includes("/collections")) {
    return "collections";
  }

  if (pathValue.includes("/environments")) {
    return "environments";
  }

  if (pathValue.includes("/runs")) {
    return "runs";
  }

  if (pathValue.startsWith("/api/workspaces")) {
    return "workspaces";
  }

  return "api";
};

const extractObjectProperties = (
  schema: JsonValue,
): { properties: JsonObject; required: Set<string> } | null => {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return null;
  }

  const schemaObject = schema as JsonObject;
  const rawProperties = schemaObject.properties;
  const rawRequired = schemaObject.required;

  if (!rawProperties || typeof rawProperties !== "object" || Array.isArray(rawProperties)) {
    return null;
  }

  const required = new Set<string>();

  if (Array.isArray(rawRequired)) {
    for (const entry of rawRequired) {
      if (typeof entry === "string") {
        required.add(entry);
      }
    }
  }

  return {
    properties: rawProperties as JsonObject,
    required,
  };
};

const extractPathParameterNames = (openApiPath: string): string[] => {
  const names = openApiPath.match(/\{([^}]+)\}/g) ?? [];

  return names.map((name) => name.slice(1, -1));
};

const toParameters = (contract: EndpointContract): OpenApiParameter[] => {
  const openApiPath = toOpenApiPath(contract.path);
  const pathParamNames = extractPathParameterNames(openApiPath);
  const parameters: OpenApiParameter[] = [];

  const paramsSchema = contract.request.params
    ? toJsonSchema(contract.request.params)
    : null;
  const paramsDescriptor = paramsSchema
    ? extractObjectProperties(paramsSchema)
    : null;

  for (const name of pathParamNames) {
    const schema = paramsDescriptor?.properties[name] ?? { type: "string" };

    parameters.push({
      name,
      in: "path",
      required: true,
      schema,
    });
  }

  const querySchema = contract.request.query ? toJsonSchema(contract.request.query) : null;
  const queryDescriptor = querySchema ? extractObjectProperties(querySchema) : null;

  if (queryDescriptor) {
    const queryNames = Object.keys(queryDescriptor.properties).sort();

    for (const queryName of queryNames) {
      const schema = queryDescriptor.properties[queryName];

      parameters.push({
        name: queryName,
        in: "query",
        required: queryDescriptor.required.has(queryName),
        schema,
      });
    }
  }

  return parameters;
};

const toOperation = (contract: EndpointContract): OpenApiOperation => {
  const parameters = toParameters(contract);
  const responses: Record<string, OpenApiResponse> = {
    [String(contract.responses.success.status)]: {
      description: "Success",
      content: {
        "application/json": {
          schema: toJsonSchema(contract.responses.success.schema),
        },
      },
    },
  };

  for (const error of contract.responses.errors) {
    responses[String(error.status)] = {
      description: error.description,
      content: {
        "application/json": {
          schema: toJsonSchema(error.schema),
        },
      },
    };
  }

  const operation: OpenApiOperation = {
    operationId: toOperationId(contract),
    tags: [toTag(contract.path)],
    responses,
  };

  if (contract.auth === "bearer") {
    operation.security = [{ bearerAuth: [] }];
  }

  if (parameters.length > 0) {
    operation.parameters = parameters;
  }

  if (contract.request.body) {
    operation.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: toJsonSchema(contract.request.body),
        },
      },
    };
  }

  return operation;
};

const methodRank = (method: string): number => {
  const index = METHOD_ORDER.indexOf(method as EndpointContract["method"]);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const compareContracts = (left: EndpointContract, right: EndpointContract): number => {
  if (left.path !== right.path) {
    return left.path.localeCompare(right.path);
  }

  return methodRank(left.method) - methodRank(right.method);
};

const sortJson = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

  if (value && typeof value === "object") {
    const sorted: Record<string, JsonValue> = {};

    for (const key of Object.keys(value).sort()) {
      const current = (value as Record<string, JsonValue>)[key];

      if (current !== undefined) {
        sorted[key] = sortJson(current);
      }
    }

    return sorted;
  }

  return value;
};

export const openApiFilePath = path.resolve(
  process.cwd(),
  "contracts/generated/openapi.json",
);

export const buildOpenApiSchema = (): OpenApiSchema => {
  const sortedContracts = [...allContracts].sort(compareContracts);
  const paths: Record<string, Record<string, OpenApiOperation>> = {};

  for (const contract of sortedContracts) {
    const openApiPath = toOpenApiPath(contract.path);
    const methodKey = contract.method.toLowerCase();
    const operation = toOperation(contract);

    paths[openApiPath] ??= {};
    paths[openApiPath][methodKey] = operation;
  }

  const tags = Array.from(
    new Set(sortedContracts.map((contract) => toTag(contract.path))),
  )
    .sort((left, right) => left.localeCompare(right))
    .map((name) => ({ name }));

  return {
    openapi: "3.1.0",
    info: {
      title: "role-node API",
      version: "1.0.0",
    },
    tags,
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };
};

export const formatOpenApi = (schema: OpenApiSchema): string => {
  return `${JSON.stringify(sortJson(schema as JsonValue), null, 2)}\n`;
};

export const readOpenApiFile = (): OpenApiSchema => {
  const raw = readFileSync(openApiFilePath, "utf8");
  return JSON.parse(raw) as OpenApiSchema;
};
