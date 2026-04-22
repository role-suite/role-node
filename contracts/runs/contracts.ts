import { z } from "zod";

import {
  createRunSchema,
  workspaceRunByIdParamsSchema,
  workspaceRunParamsSchema,
} from "../../src/modules/runs/runs.schema.js";
import { ROUTE_PATTERNS } from "../../src/shared/http/routes.js";
import {
  apiErrorSchema,
  apiObjectSuccessSchema,
  idSchema,
  isoDateTimeStringSchema,
  standardRouteErrors,
  type EndpointContract,
} from "../shared.js";

const runKeyValueSchema = z
  .object({
    key: z.string(),
    value: z.string(),
    enabled: z.boolean().optional(),
  })
  .strict();

const runRequestAuthSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("none") }).strict(),
  z.object({ type: z.literal("bearer"), token: z.string() }).strict(),
  z
    .object({
      type: z.literal("basic"),
      username: z.string(),
      password: z.string(),
    })
    .strict(),
]);

const runRequestBodySchema = z.union([
  z
    .object({
      mode: z.literal("raw"),
      contentType: z.string().optional(),
      raw: z.string(),
    })
    .strict(),
  z
    .object({
      mode: z.literal("urlencoded"),
      entries: z.array(runKeyValueSchema),
    })
    .strict(),
  z
    .object({
      mode: z.literal("formdata"),
      entries: z.array(z.record(z.string(), z.unknown())),
    })
    .strict(),
  z
    .object({
      mode: z.literal("binary"),
      fileName: z.string(),
      contentType: z.string().optional(),
      dataBase64: z.string(),
    })
    .strict(),
  z.object({ mode: z.literal("none") }).strict(),
  z.null(),
]);

const runResultSchema = z
  .object({
    runId: idSchema,
    status: z.enum(["running", "completed", "failed", "cancelled"]),
    startedAt: isoDateTimeStringSchema,
    completedAt: isoDateTimeStringSchema.nullable(),
    durationMs: z.number().int().nullable(),
    request: z
      .object({
        method: z.enum([
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
          "HEAD",
          "OPTIONS",
        ]),
        url: z.string(),
        headers: z.array(runKeyValueSchema),
        queryParams: z.array(runKeyValueSchema),
        body: runRequestBodySchema,
        auth: runRequestAuthSchema,
        resolvedVariables: z.record(z.string(), z.string()),
        timeoutMs: z.number().int().positive(),
      })
      .strict(),
    response: z
      .object({
        status: z.number().int(),
        headers: z.record(z.string(), z.string()),
        body: z.string().nullable(),
        bodyBase64: z.string().nullable(),
        truncated: z.boolean(),
        sizeBytes: z.number().int().nonnegative(),
      })
      .strict()
      .nullable(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.string(), z.unknown()).optional(),
      })
      .strict()
      .nullable(),
  })
  .strict();

export const runContracts: EndpointContract[] = [
  {
    method: "POST",
    path: ROUTE_PATTERNS.runs.create,
    auth: "bearer",
    request: {
      params: workspaceRunParamsSchema,
      body: createRunSchema,
    },
    responses: {
      success: { status: 201, schema: apiObjectSuccessSchema(runResultSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
        { status: 408, schema: apiErrorSchema, description: "Run timeout" },
        {
          status: 413,
          schema: apiErrorSchema,
          description: "Run response too large",
        },
        {
          status: 422,
          schema: apiErrorSchema,
          description: "Run blocked by policy",
        },
        {
          status: 502,
          schema: apiErrorSchema,
          description: "Run network error",
        },
      ],
    },
  },
  {
    method: "GET",
    path: ROUTE_PATTERNS.runs.byId,
    auth: "bearer",
    request: { params: workspaceRunByIdParamsSchema },
    responses: {
      success: { status: 200, schema: apiObjectSuccessSchema(runResultSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "POST",
    path: ROUTE_PATTERNS.runs.cancel,
    auth: "bearer",
    request: { params: workspaceRunByIdParamsSchema },
    responses: {
      success: { status: 200, schema: apiObjectSuccessSchema(runResultSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
];
