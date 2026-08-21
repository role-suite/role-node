import { z } from "zod";
import { createDocument, type ZodOpenApiPathsObject } from "zod-openapi";

import { env } from "../config/env.js";
import { authPaths } from "./paths/auth.paths.js";
import { collectionsPaths } from "./paths/collections.paths.js";
import { environmentsPaths } from "./paths/environments.paths.js";
import { importExportPaths } from "./paths/import-export.paths.js";
import { workspacesPaths } from "./paths/workspaces.paths.js";
import { BEARER_AUTH } from "./schemas/common.js";

const toOpenApiPath = (expressPath: string): string =>
  expressPath.replace(/:([A-Za-z0-9_]+)/g, "{$1}");

const convertPaths = (paths: ZodOpenApiPathsObject): ZodOpenApiPathsObject =>
  Object.fromEntries(
    Object.entries(paths).map(([path, item]) => [toOpenApiPath(path), item]),
  );

const healthPaths: ZodOpenApiPathsObject = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Liveness check",
      responses: {
        "200": {
          description: "Service is healthy",
          content: {
            "application/json": {
              schema: z.object({
                success: z.literal(true),
                data: z.object({ status: z.literal("ok") }),
              }),
            },
          },
        },
      },
    },
  },
};

export const openApiDocument = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Role API",
    version: "1.0.0",
    description:
      "REST API for managing workspaces, collections, environments, and import/export jobs. Authenticate via /api/auth/login or /api/auth/register, then use the returned access token as a Bearer token.",
  },
  servers: [
    { url: `http://localhost:${env.PORT}`, description: "Local server" },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Workspaces" },
    { name: "Collections" },
    { name: "Environments" },
    { name: "Import/Export" },
  ],
  components: {
    securitySchemes: {
      [BEARER_AUTH]: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Access token issued by POST /api/auth/login or POST /api/auth/register",
      },
    },
  },
  paths: {
    ...healthPaths,
    ...convertPaths(authPaths),
    ...convertPaths(workspacesPaths),
    ...convertPaths(collectionsPaths),
    ...convertPaths(environmentsPaths),
    ...convertPaths(importExportPaths),
  },
});
