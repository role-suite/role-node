import { z } from "zod";

const membershipRoleSchema = z.enum(["owner", "admin", "member"]);

export const workspaceSummarySchema = z
  .object({
    id: z.number().int(),
    _id: z.number().int(),
    name: z.string(),
    slug: z.string(),
    type: z.enum(["personal", "team"]),
    role: membershipRoleSchema,
  })
  .meta({ id: "WorkspaceSummary" });

export const workspaceMemberSchema = z
  .object({
    userId: z.number().int(),
    name: z.string(),
    email: z.email(),
    role: membershipRoleSchema,
  })
  .meta({ id: "WorkspaceMember" });

export const workspaceInvitationSchema = z
  .object({
    id: z.number().int(),
    workspaceId: z.number().int(),
    email: z.email(),
    role: membershipRoleSchema.exclude(["owner"]),
    token: z.string(),
    expiresAt: z.iso.datetime(),
  })
  .meta({ id: "WorkspaceInvitation" });

export const workspaceEventSchema = z
  .object({
    id: z.number().int(),
    workspaceId: z.number().int(),
    actorUserId: z.number().int(),
    entity: z.string(),
    action: z.string(),
    entityId: z.number().int().nullable(),
    payload: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.iso.datetime(),
  })
  .meta({ id: "WorkspaceEvent" });
