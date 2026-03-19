import { getDb } from "../../config/db.js";
import type { DatabaseClient } from "../../types/db.js";

export type Collection = {
  id: number;
  workspaceId: number;
  name: string;
  description: string | null;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CollectionEndpoint = {
  id: number;
  collectionId: number;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  url: string;
  headers: string;
  queryParams: string;
  body: string | null;
  auth: string | null;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

type CollectionRow = {
  id: number;
  workspace_id: number;
  name: string;
  description: string | null;
  created_by_user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
};

type CollectionEndpointRow = {
  id: number;
  collection_id: number;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  url: string;
  headers_json: string;
  query_params_json: string;
  body_json: string | null;
  auth_json: string | null;
  position: number;
  created_by_user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
};

const COLLECTIONS_TABLE = "collections";
const COLLECTION_ENDPOINTS_TABLE = "collection_endpoints";

let dbOverride: DatabaseClient | null = null;

const resolveDb = (): DatabaseClient => {
  return dbOverride ?? getDb();
};

export const setCollectionsRepoDbClient = (
  dbClient: DatabaseClient | null,
): void => {
  dbOverride = dbClient;
};

const resolveToken = (index: number): string => {
  return resolveDb().dialect === "postgres" ? `$${index}` : "?";
};

const toDate = (value: Date | string): Date => {
  return value instanceof Date ? value : new Date(value);
};

const mapCollectionRow = (row: CollectionRow): Collection => {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    name: row.name,
    description: row.description,
    createdByUserId: row.created_by_user_id,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
};

const mapCollectionEndpointRow = (
  row: CollectionEndpointRow,
): CollectionEndpoint => {
  return {
    id: row.id,
    collectionId: row.collection_id,
    name: row.name,
    method: row.method,
    url: row.url,
    headers: row.headers_json,
    queryParams: row.query_params_json,
    body: row.body_json,
    auth: row.auth_json,
    position: row.position,
    createdByUserId: row.created_by_user_id,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
};

export const collectionsRepo = {
  async create(payload: {
    workspaceId: number;
    name: string;
    description: string | null;
    createdByUserId: number;
  }): Promise<Collection> {
    const workspaceToken = resolveToken(1);
    const nameToken = resolveToken(2);
    const descriptionToken = resolveToken(3);
    const createdByToken = resolveToken(4);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<CollectionRow>(
        `INSERT INTO ${COLLECTIONS_TABLE} (workspace_id, name, description, created_by_user_id) VALUES (${workspaceToken}, ${nameToken}, ${descriptionToken}, ${createdByToken}) RETURNING id, workspace_id, name, description, created_by_user_id, created_at, updated_at`,
        [
          payload.workspaceId,
          payload.name,
          payload.description,
          payload.createdByUserId,
        ],
      );
      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create collection");
      }

      return mapCollectionRow(row);
    }

    await db.query(
      `INSERT INTO ${COLLECTIONS_TABLE} (workspace_id, name, description, created_by_user_id) VALUES (${workspaceToken}, ${nameToken}, ${descriptionToken}, ${createdByToken})`,
      [
        payload.workspaceId,
        payload.name,
        payload.description,
        payload.createdByUserId,
      ],
    );

    const result = await db.query<CollectionRow>(
      `SELECT id, workspace_id, name, description, created_by_user_id, created_at, updated_at FROM ${COLLECTIONS_TABLE} WHERE workspace_id = ${workspaceToken} ORDER BY id DESC LIMIT 1`,
      [payload.workspaceId],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create collection");
    }

    return mapCollectionRow(row);
  },

  async listByWorkspace(workspaceId: number): Promise<Collection[]> {
    const token = resolveToken(1);
    const result = await resolveDb().query<CollectionRow>(
      `SELECT id, workspace_id, name, description, created_by_user_id, created_at, updated_at FROM ${COLLECTIONS_TABLE} WHERE workspace_id = ${token} ORDER BY id ASC`,
      [workspaceId],
    );

    return result.rows.map(mapCollectionRow);
  },

  async findById(id: number): Promise<Collection | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<CollectionRow>(
      `SELECT id, workspace_id, name, description, created_by_user_id, created_at, updated_at FROM ${COLLECTIONS_TABLE} WHERE id = ${token}`,
      [id],
    );

    const row = result.rows[0];
    return row ? mapCollectionRow(row) : undefined;
  },

  async update(payload: {
    id: number;
    name: string;
    description: string | null;
  }): Promise<void> {
    const idToken = resolveToken(1);
    const nameToken = resolveToken(2);
    const descriptionToken = resolveToken(3);

    await resolveDb().query(
      `UPDATE ${COLLECTIONS_TABLE} SET name = ${nameToken}, description = ${descriptionToken}, updated_at = CURRENT_TIMESTAMP WHERE id = ${idToken}`,
      [payload.id, payload.name, payload.description],
    );
  },

  async deleteById(id: number): Promise<void> {
    const token = resolveToken(1);
    await resolveDb().query(
      `DELETE FROM ${COLLECTIONS_TABLE} WHERE id = ${token}`,
      [id],
    );
  },

  async createEndpoint(payload: {
    collectionId: number;
    name: string;
    method: CollectionEndpoint["method"];
    url: string;
    headers: string;
    queryParams: string;
    body: string | null;
    auth: string | null;
    position: number;
    createdByUserId: number;
  }): Promise<CollectionEndpoint> {
    const collectionToken = resolveToken(1);
    const nameToken = resolveToken(2);
    const methodToken = resolveToken(3);
    const urlToken = resolveToken(4);
    const headersToken = resolveToken(5);
    const queryToken = resolveToken(6);
    const bodyToken = resolveToken(7);
    const authToken = resolveToken(8);
    const positionToken = resolveToken(9);
    const createdByToken = resolveToken(10);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<CollectionEndpointRow>(
        `INSERT INTO ${COLLECTION_ENDPOINTS_TABLE} (collection_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id) VALUES (${collectionToken}, ${nameToken}, ${methodToken}, ${urlToken}, ${headersToken}, ${queryToken}, ${bodyToken}, ${authToken}, ${positionToken}, ${createdByToken}) RETURNING id, collection_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at`,
        [
          payload.collectionId,
          payload.name,
          payload.method,
          payload.url,
          payload.headers,
          payload.queryParams,
          payload.body,
          payload.auth,
          payload.position,
          payload.createdByUserId,
        ],
      );
      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create collection endpoint");
      }

      return mapCollectionEndpointRow(row);
    }

    await db.query(
      `INSERT INTO ${COLLECTION_ENDPOINTS_TABLE} (collection_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id) VALUES (${collectionToken}, ${nameToken}, ${methodToken}, ${urlToken}, ${headersToken}, ${queryToken}, ${bodyToken}, ${authToken}, ${positionToken}, ${createdByToken})`,
      [
        payload.collectionId,
        payload.name,
        payload.method,
        payload.url,
        payload.headers,
        payload.queryParams,
        payload.body,
        payload.auth,
        payload.position,
        payload.createdByUserId,
      ],
    );

    const result = await db.query<CollectionEndpointRow>(
      `SELECT id, collection_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_ENDPOINTS_TABLE} WHERE collection_id = ${collectionToken} ORDER BY id DESC LIMIT 1`,
      [payload.collectionId],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create collection endpoint");
    }

    return mapCollectionEndpointRow(row);
  },

  async listEndpointsByCollection(
    collectionId: number,
  ): Promise<CollectionEndpoint[]> {
    const token = resolveToken(1);
    const result = await resolveDb().query<CollectionEndpointRow>(
      `SELECT id, collection_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_ENDPOINTS_TABLE} WHERE collection_id = ${token} ORDER BY position ASC, id ASC`,
      [collectionId],
    );

    return result.rows.map(mapCollectionEndpointRow);
  },

  async findEndpointById(id: number): Promise<CollectionEndpoint | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<CollectionEndpointRow>(
      `SELECT id, collection_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_ENDPOINTS_TABLE} WHERE id = ${token}`,
      [id],
    );

    const row = result.rows[0];
    return row ? mapCollectionEndpointRow(row) : undefined;
  },

  async updateEndpoint(payload: {
    id: number;
    name: string;
    method: CollectionEndpoint["method"];
    url: string;
    headers: string;
    queryParams: string;
    body: string | null;
    auth: string | null;
    position: number;
  }): Promise<void> {
    const idToken = resolveToken(1);
    const nameToken = resolveToken(2);
    const methodToken = resolveToken(3);
    const urlToken = resolveToken(4);
    const headersToken = resolveToken(5);
    const queryToken = resolveToken(6);
    const bodyToken = resolveToken(7);
    const authToken = resolveToken(8);
    const positionToken = resolveToken(9);

    await resolveDb().query(
      `UPDATE ${COLLECTION_ENDPOINTS_TABLE} SET name = ${nameToken}, method = ${methodToken}, url = ${urlToken}, headers_json = ${headersToken}, query_params_json = ${queryToken}, body_json = ${bodyToken}, auth_json = ${authToken}, position = ${positionToken}, updated_at = CURRENT_TIMESTAMP WHERE id = ${idToken}`,
      [
        payload.id,
        payload.name,
        payload.method,
        payload.url,
        payload.headers,
        payload.queryParams,
        payload.body,
        payload.auth,
        payload.position,
      ],
    );
  },

  async deleteEndpointById(id: number): Promise<void> {
    const token = resolveToken(1);
    await resolveDb().query(
      `DELETE FROM ${COLLECTION_ENDPOINTS_TABLE} WHERE id = ${token}`,
      [id],
    );
  },
};
