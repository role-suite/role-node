import { authRepo } from "../auth/auth.repo.js";
import { appResponse } from "../../shared/app-response.js";

import {
  collectionsRepo,
  type Collection,
  type CollectionEndpoint,
} from "./collections.repo.js";
import type {
  CreateCollectionEndpointInput,
  CreateCollectionInput,
  UpdateCollectionEndpointInput,
  UpdateCollectionInput,
} from "./collections.schema.js";

type WorkspaceRole = "owner" | "admin" | "member";

type CollectionResponse = {
  id: number;
  workspaceId: number;
  name: string;
  description: string | null;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

type EndpointKeyValue = {
  key: string;
  value: string;
  enabled?: boolean;
};

type EndpointBody = {
  contentType?: string;
  raw?: string;
};

type EndpointAuth =
  | { type: "none" }
  | { type: "bearer"; token: string }
  | { type: "basic"; username: string; password: string };

type CollectionEndpointResponse = {
  id: number;
  collectionId: number;
  name: string;
  method: CollectionEndpoint["method"];
  url: string;
  headers: EndpointKeyValue[];
  queryParams: EndpointKeyValue[];
  body: EndpointBody | null;
  auth: EndpointAuth | null;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const toJson = (value: unknown): string => {
  return JSON.stringify(value);
};

const mapCollection = (collection: Collection): CollectionResponse => {
  return {
    id: collection.id,
    workspaceId: collection.workspaceId,
    name: collection.name,
    description: collection.description,
    createdByUserId: collection.createdByUserId,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
};

const mapEndpoint = (
  endpoint: CollectionEndpoint,
): CollectionEndpointResponse => {
  return {
    id: endpoint.id,
    collectionId: endpoint.collectionId,
    name: endpoint.name,
    method: endpoint.method,
    url: endpoint.url,
    headers: parseJson<EndpointKeyValue[]>(endpoint.headers, []),
    queryParams: parseJson<EndpointKeyValue[]>(endpoint.queryParams, []),
    body: parseJson<EndpointBody | null>(endpoint.body, null),
    auth: parseJson<EndpointAuth | null>(endpoint.auth, null),
    position: endpoint.position,
    createdByUserId: endpoint.createdByUserId,
    createdAt: endpoint.createdAt,
    updatedAt: endpoint.updatedAt,
  };
};

const requireWorkspaceMembership = async (
  userId: number,
  workspaceId: number,
): Promise<{ role: WorkspaceRole }> => {
  const membership = await authRepo.findMembershipByUserAndWorkspace(
    userId,
    workspaceId,
  );

  if (!membership) {
    throw appResponse.withStatus(403, "Workspace access denied");
  }

  return { role: membership.role };
};

const requireWorkspaceWriterRole = async (
  userId: number,
  workspaceId: number,
): Promise<void> => {
  const membership = await requireWorkspaceMembership(userId, workspaceId);

  if (membership.role === "member") {
    throw appResponse.withStatus(
      403,
      "Only workspace owners and admins can modify collections",
    );
  }
};

const requireWorkspaceExists = async (workspaceId: number): Promise<void> => {
  const workspace = await authRepo.findWorkspaceById(workspaceId);

  if (!workspace) {
    throw appResponse.withStatus(404, "Workspace not found");
  }
};

const requireCollectionInWorkspace = async (
  workspaceId: number,
  collectionId: number,
): Promise<Collection> => {
  const collection = await collectionsRepo.findById(collectionId);

  if (!collection || collection.workspaceId !== workspaceId) {
    throw appResponse.withStatus(404, "Collection not found");
  }

  return collection;
};

export const collectionsService = {
  async listForWorkspace(
    userId: number,
    workspaceId: number,
  ): Promise<CollectionResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);
    await requireWorkspaceExists(workspaceId);

    const collections = await collectionsRepo.listByWorkspace(workspaceId);
    return collections.map(mapCollection);
  },

  async getByIdForWorkspace(
    userId: number,
    workspaceId: number,
    collectionId: number,
  ): Promise<CollectionResponse> {
    await requireWorkspaceMembership(userId, workspaceId);
    const collection = await requireCollectionInWorkspace(
      workspaceId,
      collectionId,
    );
    return mapCollection(collection);
  },

  async createForWorkspace(
    userId: number,
    workspaceId: number,
    payload: CreateCollectionInput,
  ): Promise<CollectionResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireWorkspaceExists(workspaceId);

    const created = await collectionsRepo.create({
      workspaceId,
      name: payload.name,
      description: payload.description ?? null,
      createdByUserId: userId,
    });

    return mapCollection(created);
  },

  async updateForWorkspace(
    userId: number,
    workspaceId: number,
    collectionId: number,
    payload: UpdateCollectionInput,
  ): Promise<CollectionResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);

    const existing = await requireCollectionInWorkspace(
      workspaceId,
      collectionId,
    );

    await collectionsRepo.update({
      id: existing.id,
      name: payload.name ?? existing.name,
      description:
        payload.description === undefined
          ? existing.description
          : payload.description,
    });

    const updated = await collectionsRepo.findById(existing.id);

    if (!updated) {
      throw appResponse.withStatus(404, "Collection not found");
    }

    return mapCollection(updated);
  },

  async deleteForWorkspace(
    userId: number,
    workspaceId: number,
    collectionId: number,
  ): Promise<void> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    await collectionsRepo.deleteById(collectionId);
  },

  async listEndpointsForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
  ): Promise<CollectionEndpointResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    const endpoints =
      await collectionsRepo.listEndpointsByCollection(collectionId);
    return endpoints.map(mapEndpoint);
  },

  async getEndpointByIdForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
  ): Promise<CollectionEndpointResponse> {
    await requireWorkspaceMembership(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    const endpoint = await collectionsRepo.findEndpointById(endpointId);

    if (!endpoint || endpoint.collectionId !== collectionId) {
      throw appResponse.withStatus(404, "Collection endpoint not found");
    }

    return mapEndpoint(endpoint);
  },

  async createEndpointForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    payload: CreateCollectionEndpointInput,
  ): Promise<CollectionEndpointResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);

    const endpoint = await collectionsRepo.createEndpoint({
      collectionId,
      name: payload.name,
      method: payload.method,
      url: payload.url,
      headers: toJson(payload.headers ?? []),
      queryParams: toJson(payload.queryParams ?? []),
      body: payload.body ? toJson(payload.body) : null,
      auth: payload.auth ? toJson(payload.auth) : null,
      position: payload.position ?? 0,
      createdByUserId: userId,
    });

    return mapEndpoint(endpoint);
  },

  async updateEndpointForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
    payload: UpdateCollectionEndpointInput,
  ): Promise<CollectionEndpointResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);

    const existing = await collectionsRepo.findEndpointById(endpointId);

    if (!existing || existing.collectionId !== collectionId) {
      throw appResponse.withStatus(404, "Collection endpoint not found");
    }

    const nextHeaders =
      payload.headers === undefined
        ? parseJson<EndpointKeyValue[]>(existing.headers, [])
        : payload.headers;
    const nextQuery =
      payload.queryParams === undefined
        ? parseJson<EndpointKeyValue[]>(existing.queryParams, [])
        : payload.queryParams;
    const nextBody =
      payload.body === undefined
        ? parseJson<EndpointBody | null>(existing.body, null)
        : payload.body;
    const nextAuth =
      payload.auth === undefined
        ? parseJson<EndpointAuth | null>(existing.auth, null)
        : payload.auth;

    await collectionsRepo.updateEndpoint({
      id: existing.id,
      name: payload.name ?? existing.name,
      method: payload.method ?? existing.method,
      url: payload.url ?? existing.url,
      headers: toJson(nextHeaders),
      queryParams: toJson(nextQuery),
      body: nextBody ? toJson(nextBody) : null,
      auth: nextAuth ? toJson(nextAuth) : null,
      position: payload.position ?? existing.position,
    });

    const updated = await collectionsRepo.findEndpointById(existing.id);

    if (!updated) {
      throw appResponse.withStatus(404, "Collection endpoint not found");
    }

    return mapEndpoint(updated);
  },

  async deleteEndpointForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
  ): Promise<void> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    const existing = await collectionsRepo.findEndpointById(endpointId);

    if (!existing || existing.collectionId !== collectionId) {
      throw appResponse.withStatus(404, "Collection endpoint not found");
    }

    await collectionsRepo.deleteEndpointById(endpointId);
  },
};
