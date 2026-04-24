import { existsSync } from "node:fs";

import {
  buildOpenApiSchema,
  formatOpenApi,
  openApiFilePath,
  readOpenApiFile,
} from "./openapi-utils.js";

const runOpenApiCheck = (): number => {
  if (!existsSync(openApiFilePath)) {
    console.error(
      `OpenAPI artifact not found at ${openApiFilePath}. Run pnpm contracts:openapi:generate first.`,
    );
    return 1;
  }

  const current = buildOpenApiSchema();
  const previous = readOpenApiFile();
  const currentSerialized = formatOpenApi(current);
  const previousSerialized = formatOpenApi(previous);

  if (currentSerialized === previousSerialized) {
    console.log("OpenAPI artifact is up to date.");
    return 0;
  }

  console.error("OpenAPI drift detected.");
  console.error(
    "Run pnpm contracts:openapi:generate and commit the updated contracts/generated/openapi.json.",
  );
  return 1;
};

process.exit(runOpenApiCheck());
