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

export const createWorkspaceImportSchema = z
  .object({
    format: z.enum(["json"]).default("json"),
    payload: z.record(z.string(), z.unknown()),
  })
  .strict();

export type CreateWorkspaceExportInput = z.infer<
  typeof createWorkspaceExportSchema
>;
export type CreateWorkspaceImportInput = z.infer<
  typeof createWorkspaceImportSchema
>;
