import type { ZodOpenApiPathsObject } from "zod-openapi";

import {
  createWorkspaceExportSchema,
  createWorkspaceImportSchema,
  workspaceImportExportJobByIdParamsSchema,
  workspaceImportExportParamsSchema,
} from "../../modules/import-export/schema.js";
import { ROUTE_PATTERNS } from "../../shared/routes.js";
import { importExportJobSchema } from "../schemas/import-export.js";
import {
  BEARER_AUTH,
  listEnvelope,
  successEnvelope,
  withErrors,
} from "../schemas/common.js";

const auth = [{ [BEARER_AUTH]: [] }];

export const importExportPaths: ZodOpenApiPathsObject = {
  [ROUTE_PATTERNS.importExport.jobs]: {
    get: {
      tags: ["Import/Export"],
      summary: "List import/export jobs for a workspace",
      security: auth,
      requestParams: { path: workspaceImportExportParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Job list",
            content: {
              "application/json": {
                schema: listEnvelope(importExportJobSchema),
              },
            },
          },
        },
        ["401", "403"],
      ),
    },
  },
  [ROUTE_PATTERNS.importExport.jobById]: {
    get: {
      tags: ["Import/Export"],
      summary: "Get an import/export job by id",
      security: auth,
      requestParams: { path: workspaceImportExportJobByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Job",
            content: {
              "application/json": {
                schema: successEnvelope(importExportJobSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
        { "404": "Import/export job not found" },
      ),
    },
  },
  [ROUTE_PATTERNS.importExport.exports]: {
    post: {
      tags: ["Import/Export"],
      summary: "Export a workspace's collections and/or environments",
      security: auth,
      requestParams: { path: workspaceImportExportParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: createWorkspaceExportSchema,
            example: {
              format: "json",
              includeCollections: true,
              includeEnvironments: true,
            },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Export job completed",
            content: {
              "application/json": {
                schema: successEnvelope(importExportJobSchema),
              },
            },
          },
        },
        ["400", "401", "403"],
        {
          "403": "Only workspace owners and admins can run imports and exports",
        },
      ),
    },
  },
  [ROUTE_PATTERNS.importExport.imports]: {
    post: {
      tags: ["Import/Export"],
      summary: "Import collections and/or environments into a workspace",
      security: auth,
      requestParams: { path: workspaceImportExportParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: createWorkspaceImportSchema,
            example: {
              format: "json",
              payload: {
                version: 1,
                format: "role-native",
                collections: [
                  {
                    name: "Orders API",
                    endpoints: [
                      {
                        name: "Get Orders",
                        method: "GET",
                        url: "https://api.example.com/orders",
                      },
                    ],
                  },
                ],
                environments: [
                  {
                    name: "Production",
                    variables: [
                      { key: "API_BASE_URL", value: "https://api.example.com" },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Import job completed",
            content: {
              "application/json": {
                schema: successEnvelope(importExportJobSchema),
              },
            },
          },
        },
        ["400", "401", "403"],
        {
          "403": "Only workspace owners and admins can run imports and exports",
        },
      ),
    },
  },
};
