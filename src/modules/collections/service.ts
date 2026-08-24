import { authRepo, withAuthTransaction } from "../auth/repo.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import { workspaceEventsService } from "../workspaces/events.service.js";

import {
  collectionsRepo,
  type Collection,
  type CollectionEndpoint,
  type CollectionEndpointExample,
  type CollectionFolder,
} from "./repo.js";
import type {
  CreateCollectionEndpointExampleInput,
  CreateCollectionEndpointInput,
  CreateCollectionFolderInput,
  CreateCollectionInput,
  UpdateCollectionEndpointExampleInput,
  UpdateCollectionEndpointInput,
  UpdateCollectionFolderInput,
  UpdateCollectionInput,
} from "./schema.js";

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

/**
 * Repo entities carry JSONB columns as already-parsed values (the pg driver
 * decodes jsonb on the way out), so response mapping only needs a type-safe
 * cast with a safe default, not a JSON.parse round trip.
 */
const asKeyValueList = (value: unknown): EndpointKeyValue[] => {
  return Array.isArray(value) ? (value as EndpointKeyValue[]) : [];
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

const normalizeEndpointBody = (value: unknown): EndpointBody | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  if ("mode" in value) {
    return value as EndpointBody;
  }

  const legacy = value as { contentType?: string; raw?: string };
  return {
    mode: "raw",
    raw: legacy.raw ?? "",
    ...(legacy.contentType !== undefined
      ? { contentType: legacy.contentType }
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
    headers: asKeyValueList(endpoint.headers),
    queryParams: asKeyValueList(endpoint.queryParams),
    body: normalizeEndpointBody(endpoint.body),
    auth: (endpoint.auth as EndpointAuth | null) ?? null,
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
    headers: asKeyValueList(example.headers),
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
    throw createAppError(ERROR_CODES.workspaces.ACCESS_DENIED);
  }

  return { role: membership.role };
};

const requireWorkspaceWriterRole = async (
  userId: number,
  workspaceId: number,
): Promise<void> => {
  const membership = await requireWorkspaceMembership(userId, workspaceId);

  if (membership.role === "member") {
    throw createAppError(ERROR_CODES.collections.MODIFY_FORBIDDEN);
  }
};

const requireCollectionInWorkspace = async (
  workspaceId: number,
  collectionId: number,
): Promise<Collection> => {
  const collection = await collectionsRepo.findById(collectionId);

  if (!collection || collection.workspaceId !== workspaceId) {
    throw createAppError(ERROR_CODES.collections.COLLECTION_NOT_FOUND);
  }

  return collection;
};

const requireFolderInCollection = async (
  collectionId: number,
  folderId: number,
): Promise<CollectionFolder> => {
  const folder = await collectionsRepo.findFolderById(folderId);

  if (!folder || folder.collectionId !== collectionId) {
    throw createAppError(ERROR_CODES.collections.FOLDER_NOT_FOUND);
  }

  return folder;
};

const requireEndpointInCollection = async (
  collectionId: number,
  endpointId: number,
): Promise<CollectionEndpoint> => {
  const endpoint = await collectionsRepo.findEndpointById(endpointId);

  if (!endpoint || endpoint.collectionId !== collectionId) {
    throw createAppError(ERROR_CODES.collections.ENDPOINT_NOT_FOUND);
  }

  return endpoint;
};

const requireExampleForEndpoint = async (
  endpointId: number,
  exampleId: number,
): Promise<CollectionEndpointExample> => {
  const example = await collectionsRepo.findExampleById(exampleId);

  if (!example || example.endpointId !== endpointId) {
    throw createAppError(ERROR_CODES.collections.EXAMPLE_NOT_FOUND);
  }

  return example;
};

/**
 * Runs the workspace-role check and the resource-scope check in parallel:
 * neither depends on the other's result, and both are independent DB round
 * trips, so serializing them (as separate `await`s) only adds latency.
 */
const requireAccessAndCollection = async (
  userId: number,
  workspaceId: number,
  collectionId: number,
  roleCheck: (userId: number, workspaceId: number) => Promise<unknown>,
): Promise<Collection> => {
  const [, collection] = await Promise.all([
    roleCheck(userId, workspaceId),
    requireCollectionInWorkspace(workspaceId, collectionId),
  ]);

  return collection;
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
    throw createAppError(ERROR_CODES.collections.FOLDER_SELF_PARENT);
  }
};

export const collectionsService = {
  async listForWorkspace(
    userId: number,
    workspaceId: number,
  ): Promise<CollectionResponse[]> {
    await requireWorkspaceMembership(userId, workspaceId);

    const collections = await collectionsRepo.listByWorkspace(workspaceId);
    return collections.map(mapCollection);
  },

  async getByIdForWorkspace(
    userId: number,
    workspaceId: number,
    collectionId: number,
  ): Promise<CollectionResponse> {
    const collection = await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceMembership,
    );
    return mapCollection(collection);
  },

  async createForWorkspace(
    userId: number,
    workspaceId: number,
    payload: CreateCollectionInput,
  ): Promise<CollectionResponse> {
    await requireWorkspaceWriterRole(userId, workspaceId);

    const created = await withAuthTransaction(async (tx) => {
      const row = await collectionsRepo.create(
        {
          workspaceId,
          name: payload.name,
          description: payload.description ?? null,
          createdByUserId: userId,
        },
        tx,
      );

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection",
          action: "created",
          entityId: row.id,
          payload: {
            name: row.name,
          },
        },
        tx,
      );

      return row;
    });

    return mapCollection(created);
  },

  async updateForWorkspace(
    userId: number,
    workspaceId: number,
    collectionId: number,
    payload: UpdateCollectionInput,
  ): Promise<CollectionResponse> {
    const existing = await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );

    const updated = await withAuthTransaction(async (tx) => {
      const row = await collectionsRepo.update(
        {
          id: existing.id,
          name: payload.name ?? existing.name,
          description:
            payload.description === undefined
              ? existing.description
              : payload.description,
        },
        tx,
      );

      if (!row) {
        throw createAppError(ERROR_CODES.collections.COLLECTION_NOT_FOUND);
      }

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection",
          action: "updated",
          entityId: row.id,
          payload: {
            name: row.name,
          },
        },
        tx,
      );

      return row;
    });

    return mapCollection(updated);
  },

  async deleteForWorkspace(
    userId: number,
    workspaceId: number,
    collectionId: number,
  ): Promise<void> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );

    await withAuthTransaction(async (tx) => {
      await collectionsRepo.deleteById(collectionId, tx);

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection",
          action: "deleted",
          entityId: collectionId,
        },
        tx,
      );
    });
  },

  async listEndpointsForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
  ): Promise<CollectionEndpointResponse[]> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceMembership,
    );
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
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceMembership,
    );
    const endpoint = await requireEndpointInCollection(
      collectionId,
      endpointId,
    );

    return mapEndpoint(endpoint);
  },

  async createEndpointForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    payload: CreateCollectionEndpointInput,
  ): Promise<CollectionEndpointResponse> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );

    if (payload.folderId !== undefined && payload.folderId !== null) {
      await requireFolderInCollection(collectionId, payload.folderId);
    }

    const endpoint = await withAuthTransaction(async (tx) => {
      const row = await collectionsRepo.createEndpoint(
        {
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
        },
        tx,
      );

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_endpoint",
          action: "created",
          entityId: row.id,
          payload: {
            collectionId,
            method: row.method,
            name: row.name,
          },
        },
        tx,
      );

      return row;
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
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );

    const existing = await requireEndpointInCollection(
      collectionId,
      endpointId,
    );

    const nextHeaders =
      payload.headers === undefined
        ? asKeyValueList(existing.headers)
        : payload.headers;
    const nextQuery =
      payload.queryParams === undefined
        ? asKeyValueList(existing.queryParams)
        : payload.queryParams;
    const nextBody =
      payload.body === undefined
        ? normalizeEndpointBody(existing.body)
        : payload.body;
    const nextAuth =
      payload.auth === undefined
        ? ((existing.auth as EndpointAuth | null) ?? null)
        : payload.auth;

    if (payload.folderId !== undefined) {
      if (payload.folderId !== null) {
        await requireFolderInCollection(collectionId, payload.folderId);
      }
    }

    const updated = await withAuthTransaction(async (tx) => {
      const row = await collectionsRepo.updateEndpoint(
        {
          id: existing.id,
          folderId:
            payload.folderId === undefined
              ? existing.folderId
              : payload.folderId,
          name: payload.name ?? existing.name,
          method: payload.method ?? existing.method,
          url: payload.url ?? existing.url,
          headers: toJson(nextHeaders),
          queryParams: toJson(nextQuery),
          body: nextBody ? toJson(nextBody) : null,
          auth: nextAuth ? toJson(nextAuth) : null,
          position: payload.position ?? existing.position,
        },
        tx,
      );

      if (!row) {
        throw createAppError(ERROR_CODES.collections.ENDPOINT_NOT_FOUND);
      }

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_endpoint",
          action: "updated",
          entityId: row.id,
          payload: {
            collectionId,
            method: row.method,
            name: row.name,
          },
        },
        tx,
      );

      return row;
    });

    return mapEndpoint(updated);
  },

  async deleteEndpointForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
  ): Promise<void> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );
    await requireEndpointInCollection(collectionId, endpointId);

    await withAuthTransaction(async (tx) => {
      await collectionsRepo.deleteEndpointById(endpointId, tx);

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_endpoint",
          action: "deleted",
          entityId: endpointId,
          payload: {
            collectionId,
          },
        },
        tx,
      );
    });
  },

  async listFoldersForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
  ): Promise<CollectionFolderResponse[]> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceMembership,
    );
    const folders = await collectionsRepo.listFoldersByCollection(collectionId);
    return folders.map(mapFolder);
  },

  async getFolderByIdForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    folderId: number,
  ): Promise<CollectionFolderResponse> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceMembership,
    );
    const folder = await requireFolderInCollection(collectionId, folderId);
    return mapFolder(folder);
  },

  async createFolderForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    payload: CreateCollectionFolderInput,
  ): Promise<CollectionFolderResponse> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );
    await validateParentFolderReference(
      collectionId,
      payload.parentFolderId ?? null,
    );

    const folder = await withAuthTransaction(async (tx) => {
      const row = await collectionsRepo.createFolder(
        {
          collectionId,
          parentFolderId: payload.parentFolderId ?? null,
          name: payload.name,
          position: payload.position ?? 0,
          createdByUserId: userId,
        },
        tx,
      );

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_folder",
          action: "created",
          entityId: row.id,
          payload: {
            collectionId,
            name: row.name,
          },
        },
        tx,
      );

      return row;
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
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );
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

    const updated = await withAuthTransaction(async (tx) => {
      const row = await collectionsRepo.updateFolder(
        {
          id: existing.id,
          parentFolderId: nextParentFolderId,
          name: payload.name ?? existing.name,
          position: payload.position ?? existing.position,
        },
        tx,
      );

      if (!row) {
        throw createAppError(ERROR_CODES.collections.FOLDER_NOT_FOUND);
      }

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_folder",
          action: "updated",
          entityId: row.id,
          payload: {
            collectionId,
            name: row.name,
          },
        },
        tx,
      );

      return row;
    });

    return mapFolder(updated);
  },

  async deleteFolderForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    folderId: number,
  ): Promise<void> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );
    await requireFolderInCollection(collectionId, folderId);

    await withAuthTransaction(async (tx) => {
      await collectionsRepo.deleteFolderById(folderId, tx);

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_folder",
          action: "deleted",
          entityId: folderId,
          payload: {
            collectionId,
          },
        },
        tx,
      );
    });
  },

  async listExamplesForEndpoint(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
  ): Promise<CollectionEndpointExampleResponse[]> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceMembership,
    );
    await requireEndpointInCollection(collectionId, endpointId);

    const examples = await collectionsRepo.listExamplesByEndpoint(endpointId);
    return examples.map(mapExample);
  },

  async getExampleByIdForEndpoint(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
    exampleId: number,
  ): Promise<CollectionEndpointExampleResponse> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceMembership,
    );
    await requireEndpointInCollection(collectionId, endpointId);
    const example = await requireExampleForEndpoint(endpointId, exampleId);

    return mapExample(example);
  },

  async createExampleForEndpoint(
    userId: number,
    workspaceId: number,
    collectionId: number,
    endpointId: number,
    payload: CreateCollectionEndpointExampleInput,
  ): Promise<CollectionEndpointExampleResponse> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );
    await requireEndpointInCollection(collectionId, endpointId);

    const created = await withAuthTransaction(async (tx) => {
      const row = await collectionsRepo.createEndpointExample(
        {
          endpointId,
          name: payload.name,
          statusCode: payload.statusCode ?? 200,
          headers: toJson(payload.headers ?? []),
          body: payload.body ?? null,
          position: payload.position ?? 0,
          createdByUserId: userId,
        },
        tx,
      );

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_example",
          action: "created",
          entityId: row.id,
          payload: {
            collectionId,
            endpointId,
            name: row.name,
          },
        },
        tx,
      );

      return row;
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
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );
    await requireEndpointInCollection(collectionId, endpointId);
    const existing = await requireExampleForEndpoint(endpointId, exampleId);

    const updated = await withAuthTransaction(async (tx) => {
      const row = await collectionsRepo.updateExample(
        {
          id: existing.id,
          name: payload.name ?? existing.name,
          statusCode: payload.statusCode ?? existing.statusCode,
          headers:
            payload.headers === undefined
              ? toJson(asKeyValueList(existing.headers))
              : toJson(payload.headers),
          body: payload.body === undefined ? existing.body : payload.body,
          position: payload.position ?? existing.position,
        },
        tx,
      );

      if (!row) {
        throw createAppError(ERROR_CODES.collections.EXAMPLE_NOT_FOUND);
      }

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_example",
          action: "updated",
          entityId: row.id,
          payload: {
            collectionId,
            endpointId,
            name: row.name,
          },
        },
        tx,
      );

      return row;
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
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );
    await requireEndpointInCollection(collectionId, endpointId);
    await requireExampleForEndpoint(endpointId, exampleId);

    await withAuthTransaction(async (tx) => {
      await collectionsRepo.deleteExampleById(exampleId, tx);

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_example",
          action: "deleted",
          entityId: exampleId,
          payload: {
            collectionId,
            endpointId,
          },
        },
        tx,
      );
    });
  },
};
