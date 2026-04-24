import { existsSync } from "node:fs";

import { openApiFilePath, readOpenApiFile } from "./openapi-utils.js";

type OpenApiDocument = ReturnType<typeof readOpenApiFile>;

const collectPathParams = (pathValue: string): string[] => {
  const matches = pathValue.match(/\{([^}]+)\}/g) ?? [];
  return matches.map((match) => match.slice(1, -1));
};

const lintOpenApi = (): number => {
  if (!existsSync(openApiFilePath)) {
    console.error(
      `OpenAPI artifact not found at ${openApiFilePath}. Run pnpm contracts:openapi:generate first.`,
    );
    return 1;
  }

  const document: OpenApiDocument = readOpenApiFile();
  const issues: string[] = [];

  if (document.openapi !== "3.1.0") {
    issues.push(`Expected openapi version 3.1.0, found ${document.openapi}.`);
  }

  const bearerAuth = document.components?.securitySchemes?.bearerAuth;

  if (!bearerAuth) {
    issues.push("Missing components.securitySchemes.bearerAuth.");
  } else {
    if (bearerAuth.type !== "http") {
      issues.push("components.securitySchemes.bearerAuth.type must be http.");
    }

    if (bearerAuth.scheme !== "bearer") {
      issues.push(
        "components.securitySchemes.bearerAuth.scheme must be bearer.",
      );
    }
  }

  const seenOperationIds = new Set<string>();

  for (const [pathValue, pathItem] of Object.entries(document.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      const operationKey = `${method.toUpperCase()} ${pathValue}`;

      if (!operation.operationId || operation.operationId.trim().length === 0) {
        issues.push(`${operationKey} is missing operationId.`);
      } else if (seenOperationIds.has(operation.operationId)) {
        issues.push(
          `${operationKey} reuses duplicate operationId ${operation.operationId}.`,
        );
      } else {
        seenOperationIds.add(operation.operationId);
      }

      if (!Array.isArray(operation.tags) || operation.tags.length === 0) {
        issues.push(`${operationKey} is missing tags.`);
      }

      const hasResponses =
        operation.responses && Object.keys(operation.responses).length > 0;

      if (!hasResponses) {
        issues.push(`${operationKey} is missing responses.`);
      }

      const expectedPathParams = collectPathParams(pathValue);

      for (const paramName of expectedPathParams) {
        const matchesParam = (operation.parameters ?? []).some((parameter) => {
          return (
            parameter.in === "path" &&
            parameter.name === paramName &&
            parameter.required === true
          );
        });

        if (!matchesParam) {
          issues.push(
            `${operationKey} is missing required path parameter ${paramName}.`,
          );
        }
      }
    }
  }

  if (issues.length === 0) {
    console.log("OpenAPI lint passed.");
    return 0;
  }

  console.error("OpenAPI lint failed:");

  for (const issue of issues) {
    console.error(`- ${issue}`);
  }

  return 1;
};

process.exit(lintOpenApi());
