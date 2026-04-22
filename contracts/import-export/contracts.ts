import { z } from "zod";

import {
  createWorkspaceExportSchema,
  createWorkspaceImportSchema,
  workspaceImportExportJobByIdParamsSchema,
  workspaceImportExportParamsSchema,
} from "../../src/modules/import-export/import-export.schema.js";
import { ROUTE_PATTERNS } from "../../src/shared/http/routes.js";
import {
  apiSuccessSchema,
  idSchema,
  isoDateTimeStringSchema,
  standardRouteErrors,
  type EndpointContract,
} from "../shared.js";

const importExportJobSchema = z
  .object({
    id: idSchema,
    workspaceId: idSchema,
    type: z.enum(["export", "import"]),
    status: z.literal("completed"),
    format: z.literal("json"),
    summary: z.record(z.string(), z.unknown()),
    createdByUserId: idSchema,
    createdAt: isoDateTimeStringSchema,
    completedAt: isoDateTimeStringSchema,
  })
  .strict();

export const importExportContracts: EndpointContract[] = [
  {
    method: "GET",
    path: ROUTE_PATTERNS.importExport.jobs,
    auth: "bearer",
    request: { params: workspaceImportExportParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(importExportJobSchema)),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
      ],
    },
  },
  {
    method: "GET",
    path: ROUTE_PATTERNS.importExport.jobById,
    auth: "bearer",
    request: { params: workspaceImportExportJobByIdParamsSchema },
    responses: {
      success: { status: 200, schema: apiSuccessSchema(importExportJobSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "POST",
    path: ROUTE_PATTERNS.importExport.exports,
    auth: "bearer",
    request: {
      params: workspaceImportExportParamsSchema,
      body: createWorkspaceExportSchema,
    },
    responses: {
      success: { status: 201, schema: apiSuccessSchema(importExportJobSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
      ],
    },
  },
  {
    method: "POST",
    path: ROUTE_PATTERNS.importExport.imports,
    auth: "bearer",
    request: {
      params: workspaceImportExportParamsSchema,
      body: createWorkspaceImportSchema,
    },
    responses: {
      success: { status: 201, schema: apiSuccessSchema(importExportJobSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
      ],
    },
  },
];
