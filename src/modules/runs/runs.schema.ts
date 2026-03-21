import { z } from "zod";

const httpMethodSchema = z.enum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

const keyValueSchema = z
  .object({
    key: z.string().trim().min(1).max(200),
    value: z.string().max(5000),
    enabled: z.boolean().optional(),
  })
  .strict();

const requestBodySchema = z
  .object({
    contentType: z.string().trim().min(1).max(120).optional(),
    raw: z.string().max(100000).optional(),
  })
  .strict();

const requestAuthSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("none"),
    })
    .strict(),
  z
    .object({
      type: z.literal("bearer"),
      token: z.string().min(1).max(5000),
    })
    .strict(),
  z
    .object({
      type: z.literal("basic"),
      username: z.string().min(1).max(200),
      password: z.string().min(1).max(5000),
    })
    .strict(),
]);

const httpRequestDraftSchema = z
  .object({
    method: httpMethodSchema,
    url: z.string().trim().min(1).max(5000),
    headers: z.array(keyValueSchema).max(200).optional(),
    queryParams: z.array(keyValueSchema).max(200).optional(),
    body: requestBodySchema.nullable().optional(),
    auth: requestAuthSchema.optional(),
  })
  .strict();

const runSourceSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("adhoc"),
      request: httpRequestDraftSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("collectionEndpoint"),
      collectionId: z.coerce.number().int().positive(),
      endpointId: z.coerce.number().int().positive(),
    })
    .strict(),
]);

export const workspaceRunParamsSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
});

export const workspaceRunByIdParamsSchema = workspaceRunParamsSchema.extend({
  runId: z.coerce.number().int().positive(),
});

export const createRunSchema = z
  .object({
    source: runSourceSchema,
    environmentId: z.coerce.number().int().positive().optional(),
    variableOverrides: z
      .array(
        z
          .object({
            key: z.string().trim().min(1).max(200),
            value: z.string().max(10000),
          })
          .strict(),
      )
      .max(500)
      .optional(),
    options: z
      .object({
        timeoutMs: z.coerce.number().int().positive().max(60000).optional(),
        followRedirects: z.boolean().optional(),
        maxResponseBytes: z.coerce.number().int().positive().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type CreateRunInput = z.infer<typeof createRunSchema>;
