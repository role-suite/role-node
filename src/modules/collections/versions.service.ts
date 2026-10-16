import type { DatabaseClient } from "../../types/db.js";
import { withAuthTransaction } from "../auth/repo.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import { workspaceEventsService } from "../workspaces/events.service.js";

import {
  requireAccessAndCollection,
  requireWorkspaceMembership,
  requireWorkspaceWriterRole,
} from "./access.js";
import { mapCollection, type CollectionResponse } from "./mappers.js";
import { collectionsRepo } from "./repo.js";
import {
  collectionVersionsRepo,
  type CollectionSnapshot,
  type CollectionSnapshotEndpoint,
  type CollectionVersion,
} from "./versions.repo.js";
import type {
  CollectionVersionsQuery,
  CreateCollectionVersionInput,
} from "./schema.js";

const AUTO_VERSION_RETENTION = 100;

type CollectionVersionSummary = {
  id: number;
  collectionId: number;
  versionNumber: number;
  label: string | null;
  source: CollectionVersion["source"];
  createdByUserId: number;
  restoredFromVersionId: number | null;
  createdAt: Date;
};

type CollectionVersionDetail = CollectionVersionSummary & {
  snapshot: CollectionSnapshot;
};

const mapVersionSummary = (
  version: CollectionVersion,
): CollectionVersionSummary => {
  return {
    id: version.id,
    collectionId: version.collectionId,
    versionNumber: version.versionNumber,
    label: version.label,
    source: version.source,
    createdByUserId: version.createdByUserId,
    restoredFromVersionId: version.restoredFromVersionId,
    createdAt: version.createdAt,
  };
};

const asSnapshot = (value: unknown): CollectionSnapshot => {
  const candidate = (value ?? {}) as Partial<CollectionSnapshot>;

  return {
    name: typeof candidate.name === "string" ? candidate.name : "",
    description:
      typeof candidate.description === "string" ? candidate.description : null,
    folders: Array.isArray(candidate.folders) ? candidate.folders : [],
    endpoints: Array.isArray(candidate.endpoints) ? candidate.endpoints : [],
  };
};

const buildCollectionSnapshot = async (
  collectionId: number,
  dbClient?: DatabaseClient,
): Promise<CollectionSnapshot> => {
  const collection = await collectionsRepo.findById(collectionId, dbClient);

  if (!collection) {
    throw createAppError(ERROR_CODES.collections.COLLECTION_NOT_FOUND);
  }

  const folders = await collectionsRepo.listFoldersByCollection(
    collectionId,
    dbClient,
  );
  const endpoints = await collectionsRepo.listEndpointsByCollection(
    collectionId,
    dbClient,
  );
  const snapshotEndpoints: CollectionSnapshotEndpoint[] = [];

  for (const endpoint of endpoints) {
    const examples = await collectionsRepo.listExamplesByEndpoint(
      endpoint.id,
      dbClient,
    );

    snapshotEndpoints.push({
      id: endpoint.id,
      folderId: endpoint.folderId,
      name: endpoint.name,
      method: endpoint.method,
      url: endpoint.url,
      headers: endpoint.headers,
      queryParams: endpoint.queryParams,
      body: endpoint.body,
      auth: endpoint.auth,
      position: endpoint.position,
      examples: examples.map((example) => ({
        id: example.id,
        name: example.name,
        statusCode: example.statusCode,
        headers: example.headers,
        body: example.body,
        position: example.position,
      })),
    });
  }

  return {
    name: collection.name,
    description: collection.description,
    folders: folders.map((folder) => ({
      id: folder.id,
      parentFolderId: folder.parentFolderId,
      name: folder.name,
      position: folder.position,
    })),
    endpoints: snapshotEndpoints,
  };
};

const recordCollectionSnapshot = async (
  dbClient: DatabaseClient,
  input: {
    collectionId: number;
    createdByUserId: number;
    source: CollectionVersion["source"];
    label?: string | undefined;
    restoredFromVersionId?: number | undefined;
  },
): Promise<CollectionVersion> => {
  const snapshot = await buildCollectionSnapshot(input.collectionId, dbClient);
  const versionNumber = await collectionVersionsRepo.nextVersionNumber(
    input.collectionId,
    dbClient,
  );

  const version = await collectionVersionsRepo.create(
    {
      collectionId: input.collectionId,
      versionNumber,
      label: input.label ?? null,
      source: input.source,
      snapshot,
      createdByUserId: input.createdByUserId,
      restoredFromVersionId: input.restoredFromVersionId ?? null,
    },
    dbClient,
  );

  await collectionVersionsRepo.pruneAutoVersions(
    input.collectionId,
    AUTO_VERSION_RETENTION,
    dbClient,
  );

  return version;
};

export const collectionVersionsService = {
  async listForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    query: CollectionVersionsQuery,
  ): Promise<{
    items: CollectionVersionSummary[];
    cursor: { next: number; hasMore: boolean };
  }> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceMembership,
    );

    const versions = await collectionVersionsRepo.listByCollection(
      collectionId,
      {
        limit: query.limit + 1,
        cursor: query.cursor,
      },
    );

    const hasMore = versions.length > query.limit;
    const page = hasMore ? versions.slice(0, query.limit) : versions;
    const items = page.map(mapVersionSummary);
    const nextCursor = page.at(-1)?.id ?? query.cursor ?? 0;

    return {
      items,
      cursor: {
        next: nextCursor,
        hasMore,
      },
    };
  },

  async getForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    versionId: number,
  ): Promise<CollectionVersionDetail> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceMembership,
    );

    const version = await collectionVersionsRepo.findById(versionId);

    if (!version || version.collectionId !== collectionId) {
      throw createAppError(ERROR_CODES.collections.VERSION_NOT_FOUND);
    }

    return {
      ...mapVersionSummary(version),
      snapshot: asSnapshot(version.snapshot),
    };
  },

  async createForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    input: CreateCollectionVersionInput,
  ): Promise<CollectionVersionDetail> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );

    const version = await withAuthTransaction(async (tx) => {
      const row = await recordCollectionSnapshot(tx, {
        collectionId,
        createdByUserId: userId,
        source: "manual",
        label: input.label,
      });

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_version",
          action: "created",
          entityId: row.id,
          payload: {
            collectionId,
            versionNumber: row.versionNumber,
            ...(row.label !== null ? { label: row.label } : {}),
          },
        },
        tx,
      );

      return row;
    });

    return {
      ...mapVersionSummary(version),
      snapshot: asSnapshot(version.snapshot),
    };
  },

  async restoreForCollection(
    userId: number,
    workspaceId: number,
    collectionId: number,
    versionId: number,
  ): Promise<{
    collection: CollectionResponse;
    version: CollectionVersionSummary;
    restoredFromVersionId: number;
  }> {
    await requireAccessAndCollection(
      userId,
      workspaceId,
      collectionId,
      requireWorkspaceWriterRole,
    );

    const version = await collectionVersionsRepo.findById(versionId);

    if (!version || version.collectionId !== collectionId) {
      throw createAppError(ERROR_CODES.collections.VERSION_NOT_FOUND);
    }

    const snapshot = asSnapshot(version.snapshot);

    const result = await withAuthTransaction(async (tx) => {
      const preRestore = await recordCollectionSnapshot(tx, {
        collectionId,
        createdByUserId: userId,
        source: "restore",
        restoredFromVersionId: version.id,
      });

      await collectionVersionsRepo.deleteChildren(collectionId, tx);

      for (const folder of snapshot.folders) {
        await collectionVersionsRepo.insertFolderWithId(
          {
            id: folder.id,
            collectionId,
            name: folder.name,
            position: folder.position,
            createdByUserId: userId,
          },
          tx,
        );
      }

      for (const folder of snapshot.folders) {
        if (folder.parentFolderId !== null) {
          await collectionsRepo.updateFolder(
            {
              id: folder.id,
              parentFolderId: folder.parentFolderId,
              name: folder.name,
              position: folder.position,
            },
            tx,
          );
        }
      }

      for (const endpoint of snapshot.endpoints) {
        await collectionVersionsRepo.insertEndpointWithId(
          {
            id: endpoint.id,
            collectionId,
            folderId: endpoint.folderId,
            name: endpoint.name,
            method: endpoint.method,
            url: endpoint.url,
            headers: endpoint.headers,
            queryParams: endpoint.queryParams,
            body: endpoint.body,
            auth: endpoint.auth,
            position: endpoint.position,
            createdByUserId: userId,
          },
          tx,
        );

        for (const example of endpoint.examples) {
          await collectionVersionsRepo.insertExampleWithId(
            {
              id: example.id,
              endpointId: endpoint.id,
              name: example.name,
              statusCode: example.statusCode,
              headers: example.headers,
              body: example.body,
              position: example.position,
              createdByUserId: userId,
            },
            tx,
          );
        }
      }

      const collection = await collectionsRepo.update(
        {
          id: collectionId,
          name: snapshot.name,
          description: snapshot.description,
        },
        tx,
      );

      if (!collection) {
        throw createAppError(ERROR_CODES.collections.COLLECTION_NOT_FOUND);
      }

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection",
          action: "updated",
          entityId: collectionId,
          payload: {
            name: collection.name,
          },
        },
        tx,
      );

      await workspaceEventsService.publish(
        {
          workspaceId,
          actorUserId: userId,
          entity: "collection_version",
          action: "restored",
          entityId: version.id,
          payload: {
            collectionId,
            versionNumber: version.versionNumber,
            restoredFromVersionId: preRestore.id,
          },
        },
        tx,
      );

      return { collection, preRestore };
    });

    return {
      collection: mapCollection(result.collection),
      version: mapVersionSummary(result.preRestore),
      restoredFromVersionId: version.id,
    };
  },
};

export { buildCollectionSnapshot, recordCollectionSnapshot };
