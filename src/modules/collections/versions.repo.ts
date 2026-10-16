import type { DatabaseClient } from "../../types/db.js";
import { resolveCollectionsDb } from "./repo.js";

export type CollectionVersionSource = "auto" | "manual" | "restore" | "import";

export type CollectionSnapshotFolder = {
  id: number;
  parentFolderId: number | null;
  name: string;
  position: number;
};

export type CollectionSnapshotExample = {
  id: number;
  name: string;
  statusCode: number;
  headers: unknown;
  body: string | null;
  position: number;
};

export type CollectionSnapshotEndpoint = {
  id: number;
  folderId: number | null;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  url: string;
  headers: unknown;
  queryParams: unknown;
  body: unknown | null;
  auth: unknown | null;
  position: number;
  examples: CollectionSnapshotExample[];
};

export type CollectionSnapshot = {
  name: string;
  description: string | null;
  folders: CollectionSnapshotFolder[];
  endpoints: CollectionSnapshotEndpoint[];
};

export type CollectionVersion = {
  id: number;
  collectionId: number;
  versionNumber: number;
  label: string | null;
  source: CollectionVersionSource;
  snapshot: unknown;
  createdByUserId: number;
  restoredFromVersionId: number | null;
  createdAt: Date;
};

type CollectionVersionRow = {
  id: number;
  collection_id: number;
  version_number: number;
  label: string | null;
  source: CollectionVersionSource;
  snapshot_json: unknown;
  created_by_user_id: number;
  restored_from_version_id: number | null;
  created_at: Date | string;
};

const COLLECTION_VERSIONS_TABLE = "collection_versions";
const COLLECTION_FOLDERS_TABLE = "collection_folders";
const COLLECTION_ENDPOINTS_TABLE = "collection_endpoints";
const COLLECTION_ENDPOINT_EXAMPLES_TABLE = "collection_endpoint_examples";

const VERSION_COLUMNS =
  "id, collection_id, version_number, label, source, snapshot_json, created_by_user_id, restored_from_version_id, created_at";

const resolveToken = (index: number): string => {
  return `$${index}`;
};

const toDate = (value: Date | string): Date => {
  return value instanceof Date ? value : new Date(value);
};

const parseSnapshotValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as unknown;
    } catch {
      return value;
    }
  }

  return value;
};

const mapCollectionVersionRow = (
  row: CollectionVersionRow,
): CollectionVersion => {
  return {
    id: row.id,
    collectionId: row.collection_id,
    versionNumber: row.version_number,
    label: row.label,
    source: row.source,
    snapshot: parseSnapshotValue(row.snapshot_json),
    createdByUserId: row.created_by_user_id,
    restoredFromVersionId: row.restored_from_version_id,
    createdAt: toDate(row.created_at),
  };
};

const toJsonParam = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === "string" ? value : JSON.stringify(value);
};

export const collectionVersionsRepo = {
  async nextVersionNumber(
    collectionId: number,
    dbClient?: DatabaseClient,
  ): Promise<number> {
    const token = resolveToken(1);
    const result = await resolveCollectionsDb(dbClient).query<{
      version_number: number;
    }>(
      `SELECT COALESCE(MAX(version_number), 0) AS version_number FROM ${COLLECTION_VERSIONS_TABLE} WHERE collection_id = ${token}`,
      [collectionId],
    );

    return Number(result.rows[0]?.version_number ?? 0) + 1;
  },

  async create(
    payload: {
      collectionId: number;
      versionNumber: number;
      label: string | null;
      source: CollectionVersionSource;
      snapshot: CollectionSnapshot;
      createdByUserId: number;
      restoredFromVersionId?: number | null;
    },
    dbClient?: DatabaseClient,
  ): Promise<CollectionVersion> {
    const result = await resolveCollectionsDb(
      dbClient,
    ).query<CollectionVersionRow>(
      `INSERT INTO ${COLLECTION_VERSIONS_TABLE} (collection_id, version_number, label, source, snapshot_json, created_by_user_id, restored_from_version_id) VALUES (${resolveToken(1)}, ${resolveToken(2)}, ${resolveToken(3)}, ${resolveToken(4)}, ${resolveToken(5)}, ${resolveToken(6)}, ${resolveToken(7)}) RETURNING ${VERSION_COLUMNS}`,
      [
        payload.collectionId,
        payload.versionNumber,
        payload.label,
        payload.source,
        JSON.stringify(payload.snapshot),
        payload.createdByUserId,
        payload.restoredFromVersionId ?? null,
      ],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create collection version");
    }

    return mapCollectionVersionRow(row);
  },

  async listByCollection(
    collectionId: number,
    options: { limit: number; cursor?: number | undefined },
    dbClient?: DatabaseClient,
  ): Promise<CollectionVersion[]> {
    const db = resolveCollectionsDb(dbClient);

    if (options.cursor !== undefined) {
      const result = await db.query<CollectionVersionRow>(
        `SELECT ${VERSION_COLUMNS} FROM ${COLLECTION_VERSIONS_TABLE} WHERE collection_id = ${resolveToken(1)} AND id < ${resolveToken(2)} ORDER BY id DESC LIMIT ${resolveToken(3)}`,
        [collectionId, options.cursor, options.limit],
      );

      return result.rows.map(mapCollectionVersionRow);
    }

    const result = await db.query<CollectionVersionRow>(
      `SELECT ${VERSION_COLUMNS} FROM ${COLLECTION_VERSIONS_TABLE} WHERE collection_id = ${resolveToken(1)} ORDER BY id DESC LIMIT ${resolveToken(2)}`,
      [collectionId, options.limit],
    );

    return result.rows.map(mapCollectionVersionRow);
  },

  async findById(
    id: number,
    dbClient?: DatabaseClient,
  ): Promise<CollectionVersion | undefined> {
    const token = resolveToken(1);
    const result = await resolveCollectionsDb(
      dbClient,
    ).query<CollectionVersionRow>(
      `SELECT ${VERSION_COLUMNS} FROM ${COLLECTION_VERSIONS_TABLE} WHERE id = ${token}`,
      [id],
    );

    const row = result.rows[0];
    return row ? mapCollectionVersionRow(row) : undefined;
  },

  async pruneAutoVersions(
    collectionId: number,
    keep: number,
    dbClient?: DatabaseClient,
  ): Promise<void> {
    await resolveCollectionsDb(dbClient).query(
      `DELETE FROM ${COLLECTION_VERSIONS_TABLE} WHERE collection_id = ${resolveToken(1)} AND source = 'auto' AND label IS NULL AND id NOT IN (SELECT id FROM ${COLLECTION_VERSIONS_TABLE} WHERE collection_id = ${resolveToken(1)} AND source = 'auto' AND label IS NULL ORDER BY id DESC LIMIT ${resolveToken(2)})`,
      [collectionId, keep],
    );
  },

  async deleteChildren(
    collectionId: number,
    dbClient?: DatabaseClient,
  ): Promise<void> {
    const db = resolveCollectionsDb(dbClient);
    const token = resolveToken(1);

    await db.query(
      `DELETE FROM ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} WHERE endpoint_id IN (SELECT id FROM ${COLLECTION_ENDPOINTS_TABLE} WHERE collection_id = ${token})`,
      [collectionId],
    );
    await db.query(
      `DELETE FROM ${COLLECTION_ENDPOINTS_TABLE} WHERE collection_id = ${token}`,
      [collectionId],
    );
    await db.query(
      `DELETE FROM ${COLLECTION_FOLDERS_TABLE} WHERE collection_id = ${token}`,
      [collectionId],
    );
  },

  async insertFolderWithId(
    payload: {
      id: number;
      collectionId: number;
      name: string;
      position: number;
      createdByUserId: number;
    },
    dbClient?: DatabaseClient,
  ): Promise<void> {
    await resolveCollectionsDb(dbClient).query(
      `INSERT INTO ${COLLECTION_FOLDERS_TABLE} (id, collection_id, parent_folder_id, name, position, created_by_user_id) VALUES (${resolveToken(1)}, ${resolveToken(2)}, NULL, ${resolveToken(3)}, ${resolveToken(4)}, ${resolveToken(5)})`,
      [
        payload.id,
        payload.collectionId,
        payload.name,
        payload.position,
        payload.createdByUserId,
      ],
    );
  },

  async insertEndpointWithId(
    payload: {
      id: number;
      collectionId: number;
      folderId: number | null;
      name: string;
      method: CollectionSnapshotEndpoint["method"];
      url: string;
      headers: unknown;
      queryParams: unknown;
      body: unknown | null;
      auth: unknown | null;
      position: number;
      createdByUserId: number;
    },
    dbClient?: DatabaseClient,
  ): Promise<void> {
    await resolveCollectionsDb(dbClient).query(
      `INSERT INTO ${COLLECTION_ENDPOINTS_TABLE} (id, collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id) VALUES (${resolveToken(1)}, ${resolveToken(2)}, ${resolveToken(3)}, ${resolveToken(4)}, ${resolveToken(5)}, ${resolveToken(6)}, ${resolveToken(7)}, ${resolveToken(8)}, ${resolveToken(9)}, ${resolveToken(10)}, ${resolveToken(11)}, ${resolveToken(12)})`,
      [
        payload.id,
        payload.collectionId,
        payload.folderId,
        payload.name,
        payload.method,
        payload.url,
        toJsonParam(payload.headers) ?? "[]",
        toJsonParam(payload.queryParams) ?? "[]",
        toJsonParam(payload.body),
        toJsonParam(payload.auth),
        payload.position,
        payload.createdByUserId,
      ],
    );
  },

  async insertExampleWithId(
    payload: {
      id: number;
      endpointId: number;
      name: string;
      statusCode: number;
      headers: unknown;
      body: string | null;
      position: number;
      createdByUserId: number;
    },
    dbClient?: DatabaseClient,
  ): Promise<void> {
    await resolveCollectionsDb(dbClient).query(
      `INSERT INTO ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} (id, endpoint_id, name, status_code, headers_json, body_text, position, created_by_user_id) VALUES (${resolveToken(1)}, ${resolveToken(2)}, ${resolveToken(3)}, ${resolveToken(4)}, ${resolveToken(5)}, ${resolveToken(6)}, ${resolveToken(7)}, ${resolveToken(8)})`,
      [
        payload.id,
        payload.endpointId,
        payload.name,
        payload.statusCode,
        toJsonParam(payload.headers) ?? "[]",
        payload.body,
        payload.position,
        payload.createdByUserId,
      ],
    );
  },
};
