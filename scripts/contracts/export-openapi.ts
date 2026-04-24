import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  buildOpenApiSchema,
  formatOpenApi,
  openApiFilePath,
} from "./openapi-utils.js";

const schema = buildOpenApiSchema();

mkdirSync(path.dirname(openApiFilePath), { recursive: true });
writeFileSync(openApiFilePath, formatOpenApi(schema), "utf8");

console.log(`Generated OpenAPI artifact at ${openApiFilePath}`);
