import { z } from "zod";

export const workspaceCollectionParamsSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
});

export const workspaceCollectionByIdParamsSchema =
  workspaceCollectionParamsSchema.extend({
    collectionId: z.coerce.number().int().positive(),
  });

export const workspaceCollectionEndpointByIdParamsSchema =
  workspaceCollectionByIdParamsSchema.extend({
    endpointId: z.coerce.number().int().positive(),
  });

const httpMethodSchema = z.enum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

const keyValueSchema = z.object({
  key: z.string().trim().min(1).max(200),
  value: z.string().max(5000),
  enabled: z.boolean().optional(),
});

const endpointBodySchema = z
  .object({
    contentType: z.string().trim().min(1).max(120).optional(),
    raw: z.string().max(20000).optional(),
  })
  .strict();

const endpointAuthSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("none"),
    })
    .strict(),
  z
    .object({
      type: z.literal("bearer"),
      token: z.string().min(1).max(2000),
    })
    .strict(),
  z
    .object({
      type: z.literal("basic"),
      username: z.string().min(1).max(200),
      password: z.string().min(1).max(500),
    })
    .strict(),
]);

export const createCollectionSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateCollectionSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().max(2000).optional(),
  })
  .strict()
  .refine(
    (value) => value.name !== undefined || value.description !== undefined,
    {
      message: "At least one field must be provided",
      path: ["name"],
    },
  );

export const createCollectionEndpointSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    method: httpMethodSchema,
    url: z.string().trim().min(1).max(5000),
    headers: z.array(keyValueSchema).max(200).optional(),
    queryParams: z.array(keyValueSchema).max(200).optional(),
    body: endpointBodySchema.optional(),
    auth: endpointAuthSchema.optional(),
    position: z.coerce.number().int().min(0).max(100000).optional(),
  })
  .strict();

export const updateCollectionEndpointSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    method: httpMethodSchema.optional(),
    url: z.string().trim().min(1).max(5000).optional(),
    headers: z.array(keyValueSchema).max(200).optional(),
    queryParams: z.array(keyValueSchema).max(200).optional(),
    body: endpointBodySchema.optional(),
    auth: endpointAuthSchema.optional(),
    position: z.coerce.number().int().min(0).max(100000).optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.name !== undefined ||
      value.method !== undefined ||
      value.url !== undefined ||
      value.headers !== undefined ||
      value.queryParams !== undefined ||
      value.body !== undefined ||
      value.auth !== undefined ||
      value.position !== undefined,
    {
      message: "At least one field must be provided",
      path: ["name"],
    },
  );

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type CreateCollectionEndpointInput = z.infer<
  typeof createCollectionEndpointSchema
>;
export type UpdateCollectionEndpointInput = z.infer<
  typeof updateCollectionEndpointSchema
>;
