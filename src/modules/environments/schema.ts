import { z } from "zod";

export const workspaceEnvironmentParamsSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
});

export const workspaceEnvironmentByIdParamsSchema =
  workspaceEnvironmentParamsSchema.extend({
    environmentId: z.coerce.number().int().positive(),
  });

export const workspaceEnvironmentVariableByIdParamsSchema =
  workspaceEnvironmentByIdParamsSchema.extend({
    variableId: z.coerce.number().int().positive(),
  });

const environmentVariableKeySchema = z.string().trim().min(1).max(200);

export const createEnvironmentSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
  })
  .strict();

export const updateEnvironmentSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
  })
  .strict()
  .refine((value) => value.name !== undefined, {
    message: "At least one field must be provided",
    path: ["name"],
  });

export const createEnvironmentVariableSchema = z
  .object({
    key: environmentVariableKeySchema,
    value: z.string().max(10000),
    enabled: z.boolean().optional(),
    isSecret: z.boolean().optional(),
    position: z.coerce.number().int().min(0).max(100000).optional(),
  })
  .strict();

export const updateEnvironmentVariableSchema = z
  .object({
    key: environmentVariableKeySchema.optional(),
    value: z.string().max(10000).optional(),
    enabled: z.boolean().optional(),
    isSecret: z.boolean().optional(),
    position: z.coerce.number().int().min(0).max(100000).optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.key !== undefined ||
      value.value !== undefined ||
      value.enabled !== undefined ||
      value.isSecret !== undefined ||
      value.position !== undefined,
    {
      message: "At least one field must be provided",
      path: ["key"],
    },
  );

export type CreateEnvironmentInput = z.infer<typeof createEnvironmentSchema>;
export type UpdateEnvironmentInput = z.infer<typeof updateEnvironmentSchema>;
export type CreateEnvironmentVariableInput = z.infer<
  typeof createEnvironmentVariableSchema
>;
export type UpdateEnvironmentVariableInput = z.infer<
  typeof updateEnvironmentVariableSchema
>;
