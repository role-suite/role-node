import { toIsoTimestamp } from "./common.js";

type WorkspaceSummary = {
  id: number;
  _id: number;
  name: string;
  slug: string;
  type: "personal" | "team";
  role: "owner" | "admin" | "member";
};

type WorkspaceMember = {
  userId: number;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
};

type WorkspaceInvitation = {
  id: number;
  workspaceId: number;
  email: string;
  role: "owner" | "admin" | "member";
  token: string;
  expiresAt: Date;
};

type WorkspaceUpdateItem = {
  id: number;
  workspaceId: number;
  actorUserId: number;
  entity: string;
  action: string;
  entityId: number | null;
  payload: Record<string, unknown> | null;
  createdAt: Date;
};

export const toGrpcWorkspaceSummary = (item: WorkspaceSummary) => ({
  id: item.id,
  legacy_id: item._id,
  name: item.name,
  slug: item.slug,
  type: item.type,
  role: item.role,
});

export const toGrpcWorkspaceMember = (item: WorkspaceMember) => ({
  user_id: item.userId,
  name: item.name,
  email: item.email,
  role: item.role,
});

export const toGrpcWorkspaceInvitation = (item: WorkspaceInvitation) => ({
  id: item.id,
  workspace_id: item.workspaceId,
  email: item.email,
  role: item.role,
  token: item.token,
  expires_at: toIsoTimestamp(item.expiresAt),
});

export const toGrpcWorkspaceUpdate = (item: WorkspaceUpdateItem) => ({
  id: item.id,
  workspace_id: item.workspaceId,
  actor_user_id: item.actorUserId,
  entity: item.entity,
  action: item.action,
  entity_id: item.entityId ?? 0,
  payload_json: JSON.stringify(item.payload ?? {}),
  created_at: toIsoTimestamp(item.createdAt),
});
