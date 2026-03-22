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

export const workspaceCollectionFolderByIdParamsSchema =
  workspaceCollectionByIdParamsSchema.extend({
    folderId: z.coerce.number().int().positive(),
  });

export const workspaceCollectionEndpointExampleByIdParamsSchema =
  workspaceCollectionEndpointByIdParamsSchema.extend({
    exampleId: z.coerce.number().int().positive(),
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

const legacyEndpointBodySchema = z
  .object({
    contentType: z.string().trim().min(1).max(120).optional(),
    raw: z.string().max(200000).optional(),
  })
  .strict()
  .transform((value) => {
    return {
      mode: "raw" as const,
      ...(value.contentType !== undefined
        ? { contentType: value.contentType }
        : {}),
      raw: value.raw ?? "",
    };
  });

const endpointBodyRawSchema = z
  .object({
    mode: z.literal("raw"),
    contentType: z.string().trim().min(1).max(120).optional(),
    raw: z.string().max(200000),
  })
  .strict();

const endpointBodyUrlEncodedSchema = z
  .object({
    mode: z.literal("urlencoded"),
    entries: z.array(keyValueSchema).max(500),
  })
  .strict();

const formDataTextPartSchema = z
  .object({
    type: z.literal("text"),
    key: z.string().trim().min(1).max(200),
    value: z.string().max(50000),
    enabled: z.boolean().optional(),
  })
  .strict();

const formDataFilePartSchema = z
  .object({
    type: z.literal("file"),
    key: z.string().trim().min(1).max(200),
    fileName: z.string().trim().min(1).max(255),
    contentType: z.string().trim().min(1).max(120).optional(),
    dataBase64: z.string().min(1).max(2_000_000),
    enabled: z.boolean().optional(),
  })
  .strict();

const endpointBodyFormDataSchema = z
  .object({
    mode: z.literal("formdata"),
    entries: z
      .array(
        z.discriminatedUnion("type", [
          formDataTextPartSchema,
          formDataFilePartSchema,
        ]),
      )
      .max(500),
  })
  .strict();

const endpointBodyBinarySchema = z
  .object({
    mode: z.literal("binary"),
    fileName: z.string().trim().min(1).max(255),
    contentType: z.string().trim().min(1).max(120).optional(),
    dataBase64: z.string().min(1).max(2_000_000),
  })
  .strict();

const endpointBodyNoneSchema = z
  .object({
    mode: z.literal("none"),
  })
  .strict();

const endpointBodySchema = z.union([
  endpointBodyRawSchema,
  endpointBodyUrlEncodedSchema,
  endpointBodyFormDataSchema,
  endpointBodyBinarySchema,
  endpointBodyNoneSchema,
  legacyEndpointBodySchema,
]);

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
    folderId: z.coerce.number().int().positive().nullable().optional(),
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
    folderId: z.coerce.number().int().positive().nullable().optional(),
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
      value.folderId !== undefined ||
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

export const createCollectionFolderSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    parentFolderId: z.coerce.number().int().positive().nullable().optional(),
    position: z.coerce.number().int().min(0).max(100000).optional(),
  })
  .strict();

export const updateCollectionFolderSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    parentFolderId: z.coerce.number().int().positive().nullable().optional(),
    position: z.coerce.number().int().min(0).max(100000).optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.name !== undefined ||
      value.parentFolderId !== undefined ||
      value.position !== undefined,
    {
      message: "At least one field must be provided",
      path: ["name"],
    },
  );

export const createCollectionEndpointExampleSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    statusCode: z.coerce.number().int().min(100).max(599).optional(),
    headers: z.array(keyValueSchema).max(200).optional(),
    body: z.string().max(200000).nullable().optional(),
    position: z.coerce.number().int().min(0).max(100000).optional(),
  })
  .strict();

export const updateCollectionEndpointExampleSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    statusCode: z.coerce.number().int().min(100).max(599).optional(),
    headers: z.array(keyValueSchema).max(200).optional(),
    body: z.string().max(200000).nullable().optional(),
    position: z.coerce.number().int().min(0).max(100000).optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.name !== undefined ||
      value.statusCode !== undefined ||
      value.headers !== undefined ||
      value.body !== undefined ||
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
export type CreateCollectionFolderInput = z.infer<
  typeof createCollectionFolderSchema
>;
export type UpdateCollectionFolderInput = z.infer<
  typeof updateCollectionFolderSchema
>;
export type CreateCollectionEndpointExampleInput = z.infer<
  typeof createCollectionEndpointExampleSchema
>;
export type UpdateCollectionEndpointExampleInput = z.infer<
  typeof updateCollectionEndpointExampleSchema
>;
