import { z } from "zod";

export const importExportJobSchema = z
  .object({
    id: z.number().int(),
    workspaceId: z.number().int(),
    type: z.enum(["export", "import"]),
    status: z.enum(["completed"]),
    format: z.enum(["json"]),
    summary: z.record(z.string(), z.unknown()),
    artifact: z.record(z.string(), z.unknown()),
    createdByUserId: z.number().int(),
    createdAt: z.iso.datetime(),
    completedAt: z.iso.datetime(),
  })
  .meta({ id: "ImportExportJob" });
