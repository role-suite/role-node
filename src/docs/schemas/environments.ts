import { z } from "zod";

export const environmentSchema = z
  .object({
    id: z.number().int(),
    workspaceId: z.number().int(),
    name: z.string(),
    createdByUserId: z.number().int(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: "Environment" });

export const environmentVariableSchema = z
  .object({
    id: z.number().int(),
    environmentId: z.number().int(),
    key: z.string(),
    value: z.string(),
    enabled: z.boolean(),
    isSecret: z.boolean(),
    position: z.number().int(),
    createdByUserId: z.number().int(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: "EnvironmentVariable" });
