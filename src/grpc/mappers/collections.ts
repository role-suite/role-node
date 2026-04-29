import { toIsoTimestamp } from "./common.js";

type CollectionItem = {
  id: number;
  _id: number;
  workspaceId: number;
  name: string;
  description: string | null;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

type EndpointItem = {
  id: number;
  collectionId: number;
  folderId: number | null;
  name: string;
  method: string;
  url: string;
  headers: unknown;
  queryParams: unknown;
  body: unknown;
  auth: unknown;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

type FolderItem = {
  id: number;
  collectionId: number;
  parentFolderId: number | null;
  name: string;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

type ExampleItem = {
  id: number;
  endpointId: number;
  name: string;
  statusCode: number;
  headers: unknown;
  body: string | null;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

export const toGrpcCollectionItem = (item: CollectionItem) => ({
  id: item.id,
  legacy_id: item._id,
  workspace_id: item.workspaceId,
  name: item.name,
  description: item.description ?? "",
  created_by_user_id: item.createdByUserId,
  created_at: toIsoTimestamp(item.createdAt),
  updated_at: toIsoTimestamp(item.updatedAt),
});

export const toGrpcCollectionEndpointItem = (item: EndpointItem) => ({
  id: item.id,
  collection_id: item.collectionId,
  folder_id: item.folderId ?? 0,
  name: item.name,
  method: item.method,
  url: item.url,
  headers_json: JSON.stringify(item.headers ?? []),
  query_params_json: JSON.stringify(item.queryParams ?? []),
  body_json: JSON.stringify(item.body ?? null),
  auth_json: JSON.stringify(item.auth ?? null),
  position: item.position,
  created_by_user_id: item.createdByUserId,
  created_at: toIsoTimestamp(item.createdAt),
  updated_at: toIsoTimestamp(item.updatedAt),
});

export const toGrpcCollectionFolderItem = (item: FolderItem) => ({
  id: item.id,
  collection_id: item.collectionId,
  parent_folder_id: item.parentFolderId ?? 0,
  name: item.name,
  position: item.position,
  created_by_user_id: item.createdByUserId,
  created_at: toIsoTimestamp(item.createdAt),
  updated_at: toIsoTimestamp(item.updatedAt),
});

export const toGrpcCollectionExampleItem = (item: ExampleItem) => ({
  id: item.id,
  endpoint_id: item.endpointId,
  name: item.name,
  status_code: item.statusCode,
  headers_json: JSON.stringify(item.headers ?? []),
  body: item.body ?? "",
  position: item.position,
  created_by_user_id: item.createdByUserId,
  created_at: toIsoTimestamp(item.createdAt),
  updated_at: toIsoTimestamp(item.updatedAt),
});
