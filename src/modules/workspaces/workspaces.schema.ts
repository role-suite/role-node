import { z } from "zod";

const workspaceRoleSchema = z.enum(["owner", "admin", "member"]);

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2).max(120),
});

export const workspaceIdSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
});

export const listWorkspaceMembersSchema = workspaceIdSchema;

export const addWorkspaceMemberSchema = workspaceIdSchema.extend({
  email: z.email(),
  role: workspaceRoleSchema.exclude(["owner"]).default("member"),
});

export const workspaceMemberParamsSchema = workspaceIdSchema.extend({
  memberUserId: z.coerce.number().int().positive(),
});

export const updateWorkspaceMemberRoleSchema =
  workspaceMemberParamsSchema.extend({
    role: workspaceRoleSchema.exclude(["owner"]),
  });

export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberSchema>;
export type UpdateWorkspaceMemberRoleInput = z.infer<
  typeof updateWorkspaceMemberRoleSchema
>;
