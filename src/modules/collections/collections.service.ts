import { authRepo } from "../auth/auth.repo.js";
import { appResponse } from "../../shared/app-response.js";
import { workspaceEventsService } from "../workspaces/workspace-events.service.js";

import {
  collectionsRepo,
  type Collection,
  type CollectionEndpoint,
  type CollectionEndpointExample,
  type CollectionFolder,
} from "./collections.repo.js";
import type {
  CreateCollectionEndpointExampleInput,
  CreateCollectionEndpointInput,
  CreateCollectionFolderInput,
  CreateCollectionInput,
  UpdateCollectionEndpointExampleInput,
  UpdateCollectionEndpointInput,
  UpdateCollectionFolderInput,
  UpdateCollectionInput,
} from "./collections.schema.js";

type WorkspaceRole = "owner" | "admin" | "member";

type CollectionResponse = {
  id: number;
  _id: number;
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

type EndpointBody =
  | {
      mode: "raw";
      contentType?: string;
      raw: string;
    }
  | {
      mode: "urlencoded";
      entries: EndpointKeyValue[];
    }
  | {
      mode: "formdata";
      entries: Array<
        | {
            type: "text";
            key: string;
            value: string;
            enabled?: boolean;
          }
        | {
            type: "file";
            key: string;
            fileName: string;
            contentType?: string;
            dataBase64: string;
            enabled?: boolean;
          }
      >;
    }
  | {
      mode: "binary";
      fileName: string;
      contentType?: string;
      dataBase64: string;
    }
  | {
      mode: "none";
    };

type EndpointAuth =
  | { type: "none" }
  | { type: "bearer"; token: string }
  | { type: "basic"; username: string; password: string };

type CollectionEndpointResponse = {
  id: number;
  collectionId: number;
  folderId: number | null;
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

type CollectionFolderResponse = {
  id: number;
  collectionId: number;
  parentFolderId: number | null;
  name: string;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

type CollectionEndpointExampleResponse = {
  id: number;
  endpointId: number;
  name: string;
  statusCode: number;
  headers: EndpointKeyValue[];
  body: string | null;
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
    _id: collection.id,
    workspaceId: collection.workspaceId,
    name: collection.name,
    description: collection.description,
    createdByUserId: collection.createdByUserId,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
};

const parseEndpointBodyValue = (value: string | null): EndpointBody | null => {
  const parsed = parseJson<
    EndpointBody | { contentType?: string; raw?: string } | null
  >(value, null);

  if (!parsed) {
    return null;
  }

  if (typeof parsed === "object" && "mode" in parsed) {
    return parsed as EndpointBody;
  }

  return {
    mode: "raw",
    raw: parsed.raw ?? "",
    ...(parsed.contentType !== undefined
      ? { contentType: parsed.contentType }
      : {}),
  };
};

const mapEndpoint = (
  endpoint: CollectionEndpoint,
): CollectionEndpointResponse => {
  return {
    id: endpoint.id,
    collectionId: endpoint.collectionId,
    folderId: endpoint.folderId,
    name: endpoint.name,
    method: endpoint.method,
    url: endpoint.url,
    headers: parseJson<EndpointKeyValue[]>(endpoint.headers, []),
    queryParams: parseJson<EndpointKeyValue[]>(endpoint.queryParams, []),
    body: parseEndpointBodyValue(endpoint.body),
    auth: parseJson<EndpointAuth | null>(endpoint.auth, null),
    position: endpoint.position,
    createdByUserId: endpoint.createdByUserId,
    createdAt: endpoint.createdAt,
    updatedAt: endpoint.updatedAt,
  };
};

const mapFolder = (folder: CollectionFolder): CollectionFolderResponse => {
  return {
    id: folder.id,
    collectionId: folder.collectionId,
    parentFolderId: folder.parentFolderId,
    name: folder.name,
    position: folder.position,
    createdByUserId: folder.createdByUserId,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
};

const mapExample = (
  example: CollectionEndpointExample,
): CollectionEndpointExampleResponse => {
  return {
    id: example.id,
    endpointId: example.endpointId,
    name: example.name,
    statusCode: example.statusCode,
    headers: parseJson<EndpointKeyValue[]>(example.headers, []),
    body: example.body,
    position: example.position,
    createdByUserId: example.createdByUserId,
    createdAt: example.createdAt,
    updatedAt: example.updatedAt,
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

const requireFolderInCollection = async (
  collectionId: number,
  folderId: number,
): Promise<CollectionFolder> => {
  const folder = await collectionsRepo.findFolderById(folderId);

  if (!folder || folder.collectionId !== collectionId) {
    throw appResponse.withStatus(404, "Collection folder not found");
  }

  return folder;
};

const validateParentFolderReference = async (
  collectionId: number,
  parentFolderId: number | null,
  currentFolderId?: number,
): Promise<void> => {
  if (parentFolderId === null) {
    return;
  }

  const parent = await requireFolderInCollection(collectionId, parentFolderId);

  if (currentFolderId !== undefined && parent.id === currentFolderId) {
    throw appResponse.withStatus(400, "Folder cannot be its own parent");
  }
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

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection",
      action: "created",
      entityId: created.id,
      payload: {
        name: created.name,
      },
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

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection",
      action: "updated",
      entityId: updated.id,
      payload: {
        name: updated.name,
      },
    });

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

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection",
      action: "deleted",
      entityId: collectionId,
    });
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

    if (payload.folderId !== undefined && payload.folderId !== null) {
      await requireFolderInCollection(collectionId, payload.folderId);
    }

    const endpoint = await collectionsRepo.createEndpoint({
      collectionId,
      folderId: payload.folderId ?? null,
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

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection_endpoint",
      action: "created",
      entityId: endpoint.id,
      payload: {
        collectionId,
        method: endpoint.method,
        name: endpoint.name,
      },
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
        ? parseEndpointBodyValue(existing.body)
        : payload.body;
    const nextAuth =
      payload.auth === undefined
        ? parseJson<EndpointAuth | null>(existing.auth, null)
        : payload.auth;

    if (payload.folderId !== undefined) {
      if (payload.folderId !== null) {
        await requireFolderInCollection(collectionId, payload.folderId);
      }
    }

    await collectionsRepo.updateEndpoint({
      id: existing.id,
      folderId:
        payload.folderId === undefined ? existing.folderId : payload.folderId,
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

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection_endpoint",
      action: "updated",
      entityId: updated.id,
      payload: {
        collectionId,
        method: updated.method,
        name: updated.name,
      },
    });

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

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection_endpoint",
      action: "deleted",
      entityId: endpointId,
      payload: {
        collectionId,
      },
    });
  },

  async listFoldersForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
  ): Promise<CollectionFolderResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    const folders = await collectionsRepo.listFoldersByCollection(collectionId);
    return folders.map(mapFolder);
  },

  async createFolderForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    payload: CreateCollectionFolderInput,
  ): Promise<CollectionFolderResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    await validateParentFolderReference(
      collectionId,
      payload.parentFolderId ?? null,
    );

    const folder = await collectionsRepo.createFolder({
      collectionId,
      parentFolderId: payload.parentFolderId ?? null,
      name: payload.name,
      position: payload.position ?? 0,
      createdByUserId: userId,
    });

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection_folder",
      action: "created",
      entityId: folder.id,
      payload: {
        collectionId,
        name: folder.name,
      },
    });

    return mapFolder(folder);
  },

  async updateFolderForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    folderId: number,
    payload: UpdateCollectionFolderInput,
  ): Promise<CollectionFolderResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    const existing = await requireFolderInCollection(collectionId, folderId);

    const nextParentFolderId =
      payload.parentFolderId === undefined
        ? existing.parentFolderId
        : payload.parentFolderId;

    await validateParentFolderReference(
      collectionId,
      nextParentFolderId,
      existing.id,
    );

    await collectionsRepo.updateFolder({
      id: existing.id,
      parentFolderId: nextParentFolderId,
      name: payload.name ?? existing.name,
      position: payload.position ?? existing.position,
    });

    const updated = await collectionsRepo.findFolderById(existing.id);

    if (!updated) {
      throw appResponse.withStatus(404, "Collection folder not found");
    }

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection_folder",
      action: "updated",
      entityId: updated.id,
      payload: {
        collectionId,
        name: updated.name,
      },
    });

    return mapFolder(updated);
  },

  async deleteFolderForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    folderId: number,
  ): Promise<void> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    await requireFolderInCollection(collectionId, folderId);
    await collectionsRepo.deleteFolderById(folderId);

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection_folder",
      action: "deleted",
      entityId: folderId,
      payload: {
        collectionId,
      },
    });
  },

  async listExamplesForEndpoint(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
  ): Promise<CollectionEndpointExampleResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    const endpoint = await collectionsRepo.findEndpointById(endpointId);

    if (!endpoint || endpoint.collectionId !== collectionId) {
      throw appResponse.withStatus(404, "Collection endpoint not found");
    }

    const examples = await collectionsRepo.listExamplesByEndpoint(endpointId);
    return examples.map(mapExample);
  },

  async createExampleForEndpoint(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
    payload: CreateCollectionEndpointExampleInput,
  ): Promise<CollectionEndpointExampleResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    const endpoint = await collectionsRepo.findEndpointById(endpointId);

    if (!endpoint || endpoint.collectionId !== collectionId) {
      throw appResponse.withStatus(404, "Collection endpoint not found");
    }

    const created = await collectionsRepo.createEndpointExample({
      endpointId,
      name: payload.name,
      statusCode: payload.statusCode ?? 200,
      headers: toJson(payload.headers ?? []),
      body: payload.body ?? null,
      position: payload.position ?? 0,
      createdByUserId: userId,
    });

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection_example",
      action: "created",
      entityId: created.id,
      payload: {
        collectionId,
        endpointId,
        name: created.name,
      },
    });

    return mapExample(created);
  },

  async updateExampleForEndpoint(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
    exampleId: number,
    payload: UpdateCollectionEndpointExampleInput,
  ): Promise<CollectionEndpointExampleResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    const endpoint = await collectionsRepo.findEndpointById(endpointId);

    if (!endpoint || endpoint.collectionId !== collectionId) {
      throw appResponse.withStatus(404, "Collection endpoint not found");
    }

    const existing = await collectionsRepo.findExampleById(exampleId);

    if (!existing || existing.endpointId !== endpointId) {
      throw appResponse.withStatus(
        404,
        "Collection endpoint example not found",
      );
    }

    await collectionsRepo.updateExample({
      id: existing.id,
      name: payload.name ?? existing.name,
      statusCode: payload.statusCode ?? existing.statusCode,
      headers:
        payload.headers === undefined
          ? existing.headers
          : toJson(payload.headers),
      body: payload.body === undefined ? existing.body : payload.body,
      position: payload.position ?? existing.position,
    });

    const updated = await collectionsRepo.findExampleById(exampleId);

    if (!updated) {
      throw appResponse.withStatus(
        404,
        "Collection endpoint example not found",
      );
    }

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection_example",
      action: "updated",
      entityId: updated.id,
      payload: {
        collectionId,
        endpointId,
        name: updated.name,
      },
    });

    return mapExample(updated);
  },

  async deleteExampleForEndpoint(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
    exampleId: number,
  ): Promise<void> {
    await requireWorkspaceWriterRole(userId, workspaceId);
    await requireCollectionInWorkspace(workspaceId, collectionId);
    const endpoint = await collectionsRepo.findEndpointById(endpointId);

    if (!endpoint || endpoint.collectionId !== collectionId) {
      throw appResponse.withStatus(404, "Collection endpoint not found");
    }

    const existing = await collectionsRepo.findExampleById(exampleId);

    if (!existing || existing.endpointId !== endpointId) {
      throw appResponse.withStatus(
        404,
        "Collection endpoint example not found",
      );
    }

    await collectionsRepo.deleteExampleById(exampleId);

    await workspaceEventsService.publish({
      workspaceId,
      actorUserId: userId,
      entity: "collection_example",
      action: "deleted",
      entityId: exampleId,
      payload: {
        collectionId,
        endpointId,
      },
    });
  },
};
