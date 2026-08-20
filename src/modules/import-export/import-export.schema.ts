import { z } from "zod";

export const workspaceImportExportParamsSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
});

export const workspaceImportExportJobByIdParamsSchema =
  workspaceImportExportParamsSchema.extend({
    jobId: z.coerce.number().int().positive(),
  });

export const createWorkspaceExportSchema = z
  .object({
    format: z.enum(["json"]).default("json"),
    includeCollections: z.boolean().optional(),
    includeEnvironments: z.boolean().optional(),
    includeRuns: z.boolean().optional(),
  })
  .strict();

const roleNativeKeyValueSchema = z
  .object({
    key: z.string().min(1).max(200),
    value: z.string().max(5000),
    enabled: z.boolean().optional(),
  })
  .strict();

const roleNativeFolderSchema = z
  .object({
    sourceId: z.number().int().positive().optional(),
    parentSourceId: z.number().int().positive().nullable().optional(),
    name: z.string().min(1).max(120),
    position: z.number().int().min(0).max(100000).optional(),
  })
  .strict();

const roleNativeEndpointSchema = z
  .object({
    sourceId: z.number().int().positive().optional(),
    folderSourceId: z.number().int().positive().nullable().optional(),
    name: z.string().min(2).max(120),
    method: z.enum([
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "OPTIONS",
    ]),
    url: z.string().min(1).max(5000),
    headers: z.array(roleNativeKeyValueSchema).optional(),
    queryParams: z.array(roleNativeKeyValueSchema).optional(),
    body: z.record(z.string(), z.unknown()).nullable().optional(),
    auth: z.record(z.string(), z.unknown()).nullable().optional(),
    position: z.number().int().min(0).max(100000).optional(),
    examples: z
      .array(
        z
          .object({
            name: z.string().min(1).max(120),
            statusCode: z.number().int().min(100).max(599).optional(),
            headers: z.array(roleNativeKeyValueSchema).optional(),
            body: z.string().max(200000).nullable().optional(),
            position: z.number().int().min(0).max(100000).optional(),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

const roleNativeCollectionSchema = z
  .object({
    name: z.string().min(2).max(120),
    description: z.string().max(2000).nullable().optional(),
    folders: z.array(roleNativeFolderSchema).optional(),
    endpoints: z.array(roleNativeEndpointSchema).optional(),
  })
  .strict();

const roleNativeEnvironmentSchema = z
  .object({
    name: z.string().min(2).max(120),
    variables: z
      .array(
        z
          .object({
            key: z.string().min(1).max(200),
            value: z.string().max(10000),
            enabled: z.boolean().optional(),
            isSecret: z.boolean().optional(),
            position: z.number().int().min(0).max(100000).optional(),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export const roleNativeImportPayloadSchema = z
  .object({
    version: z.literal(1).optional(),
    format: z.literal("role-native").optional(),
    exportedAt: z.string().datetime().optional(),
    collections: z.array(roleNativeCollectionSchema).optional(),
    environments: z.array(roleNativeEnvironmentSchema).optional(),
  })
  .strict();

export const createWorkspaceImportSchema = z
  .object({
    format: z.enum(["json"]).default("json"),
    payload: roleNativeImportPayloadSchema,
  })
  .strict();

export type CreateWorkspaceExportInput = z.infer<
  typeof createWorkspaceExportSchema
>;
export type CreateWorkspaceImportInput = z.infer<
  typeof createWorkspaceImportSchema
>;
export type RoleNativeImportPayload = z.infer<
  typeof roleNativeImportPayloadSchema
>;
