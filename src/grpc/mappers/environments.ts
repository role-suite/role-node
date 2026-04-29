import { toIsoTimestamp } from "./common.js";

type EnvironmentItem = {
  id: number;
  workspaceId: number;
  name: string;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

type EnvironmentVariableItem = {
  id: number;
  environmentId: number;
  key: string;
  value: string;
  enabled: boolean;
  isSecret: boolean;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

export const toGrpcEnvironmentItem = (item: EnvironmentItem) => ({
  id: item.id,
  workspace_id: item.workspaceId,
  name: item.name,
  created_by_user_id: item.createdByUserId,
  created_at: toIsoTimestamp(item.createdAt),
  updated_at: toIsoTimestamp(item.updatedAt),
});

export const toGrpcEnvironmentVariableItem = (
  item: EnvironmentVariableItem,
) => ({
  id: item.id,
  environment_id: item.environmentId,
  key: item.key,
  value: item.value,
  enabled: item.enabled,
  is_secret: item.isSecret,
  position: item.position,
  created_by_user_id: item.createdByUserId,
  created_at: toIsoTimestamp(item.createdAt),
  updated_at: toIsoTimestamp(item.updatedAt),
});
