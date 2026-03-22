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
  folderId: number | null;
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

export type CollectionFolder = {
  id: number;
  collectionId: number;
  parentFolderId: number | null;
  name: string;
  position: number;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CollectionEndpointExample = {
  id: number;
  endpointId: number;
  name: string;
  statusCode: number;
  headers: string;
  body: string | null;
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
  folder_id: number | null;
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

type CollectionFolderRow = {
  id: number;
  collection_id: number;
  parent_folder_id: number | null;
  name: string;
  position: number;
  created_by_user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
};

type CollectionEndpointExampleRow = {
  id: number;
  endpoint_id: number;
  name: string;
  status_code: number;
  headers_json: string;
  body_text: string | null;
  position: number;
  created_by_user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
};

const COLLECTIONS_TABLE = "collections";
const COLLECTION_ENDPOINTS_TABLE = "collection_endpoints";
const COLLECTION_FOLDERS_TABLE = "collection_folders";
const COLLECTION_ENDPOINT_EXAMPLES_TABLE = "collection_endpoint_examples";

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
    folderId: row.folder_id,
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

const mapCollectionFolderRow = (row: CollectionFolderRow): CollectionFolder => {
  return {
    id: row.id,
    collectionId: row.collection_id,
    parentFolderId: row.parent_folder_id,
    name: row.name,
    position: row.position,
    createdByUserId: row.created_by_user_id,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
};

const mapCollectionEndpointExampleRow = (
  row: CollectionEndpointExampleRow,
): CollectionEndpointExample => {
  return {
    id: row.id,
    endpointId: row.endpoint_id,
    name: row.name,
    statusCode: row.status_code,
    headers: row.headers_json,
    body: row.body_text,
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
    folderId: number | null;
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
    const folderToken = resolveToken(2);
    const nameToken = resolveToken(3);
    const methodToken = resolveToken(4);
    const urlToken = resolveToken(5);
    const headersToken = resolveToken(6);
    const queryToken = resolveToken(7);
    const bodyToken = resolveToken(8);
    const authToken = resolveToken(9);
    const positionToken = resolveToken(10);
    const createdByToken = resolveToken(11);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<CollectionEndpointRow>(
        `INSERT INTO ${COLLECTION_ENDPOINTS_TABLE} (collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id) VALUES (${collectionToken}, ${folderToken}, ${nameToken}, ${methodToken}, ${urlToken}, ${headersToken}, ${queryToken}, ${bodyToken}, ${authToken}, ${positionToken}, ${createdByToken}) RETURNING id, collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at`,
        [
          payload.collectionId,
          payload.folderId,
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
      `INSERT INTO ${COLLECTION_ENDPOINTS_TABLE} (collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id) VALUES (${collectionToken}, ${folderToken}, ${nameToken}, ${methodToken}, ${urlToken}, ${headersToken}, ${queryToken}, ${bodyToken}, ${authToken}, ${positionToken}, ${createdByToken})`,
      [
        payload.collectionId,
        payload.folderId,
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
      `SELECT id, collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_ENDPOINTS_TABLE} WHERE collection_id = ${collectionToken} ORDER BY id DESC LIMIT 1`,
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
      `SELECT id, collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_ENDPOINTS_TABLE} WHERE collection_id = ${token} ORDER BY position ASC, id ASC`,
      [collectionId],
    );

    return result.rows.map(mapCollectionEndpointRow);
  },

  async findEndpointById(id: number): Promise<CollectionEndpoint | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<CollectionEndpointRow>(
      `SELECT id, collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_ENDPOINTS_TABLE} WHERE id = ${token}`,
      [id],
    );

    const row = result.rows[0];
    return row ? mapCollectionEndpointRow(row) : undefined;
  },

  async updateEndpoint(payload: {
    id: number;
    folderId: number | null;
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
    const folderToken = resolveToken(2);
    const nameToken = resolveToken(3);
    const methodToken = resolveToken(4);
    const urlToken = resolveToken(5);
    const headersToken = resolveToken(6);
    const queryToken = resolveToken(7);
    const bodyToken = resolveToken(8);
    const authToken = resolveToken(9);
    const positionToken = resolveToken(10);

    await resolveDb().query(
      `UPDATE ${COLLECTION_ENDPOINTS_TABLE} SET folder_id = ${folderToken}, name = ${nameToken}, method = ${methodToken}, url = ${urlToken}, headers_json = ${headersToken}, query_params_json = ${queryToken}, body_json = ${bodyToken}, auth_json = ${authToken}, position = ${positionToken}, updated_at = CURRENT_TIMESTAMP WHERE id = ${idToken}`,
      [
        payload.id,
        payload.folderId,
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

  async createFolder(payload: {
    collectionId: number;
    parentFolderId: number | null;
    name: string;
    position: number;
    createdByUserId: number;
  }): Promise<CollectionFolder> {
    const collectionToken = resolveToken(1);
    const parentToken = resolveToken(2);
    const nameToken = resolveToken(3);
    const positionToken = resolveToken(4);
    const createdByToken = resolveToken(5);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<CollectionFolderRow>(
        `INSERT INTO ${COLLECTION_FOLDERS_TABLE} (collection_id, parent_folder_id, name, position, created_by_user_id) VALUES (${collectionToken}, ${parentToken}, ${nameToken}, ${positionToken}, ${createdByToken}) RETURNING id, collection_id, parent_folder_id, name, position, created_by_user_id, created_at, updated_at`,
        [
          payload.collectionId,
          payload.parentFolderId,
          payload.name,
          payload.position,
          payload.createdByUserId,
        ],
      );

      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create collection folder");
      }

      return mapCollectionFolderRow(row);
    }

    await db.query(
      `INSERT INTO ${COLLECTION_FOLDERS_TABLE} (collection_id, parent_folder_id, name, position, created_by_user_id) VALUES (${collectionToken}, ${parentToken}, ${nameToken}, ${positionToken}, ${createdByToken})`,
      [
        payload.collectionId,
        payload.parentFolderId,
        payload.name,
        payload.position,
        payload.createdByUserId,
      ],
    );

    const result = await db.query<CollectionFolderRow>(
      `SELECT id, collection_id, parent_folder_id, name, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_FOLDERS_TABLE} WHERE collection_id = ${collectionToken} ORDER BY id DESC LIMIT 1`,
      [payload.collectionId],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create collection folder");
    }

    return mapCollectionFolderRow(row);
  },

  async listFoldersByCollection(
    collectionId: number,
  ): Promise<CollectionFolder[]> {
    const token = resolveToken(1);
    const result = await resolveDb().query<CollectionFolderRow>(
      `SELECT id, collection_id, parent_folder_id, name, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_FOLDERS_TABLE} WHERE collection_id = ${token} ORDER BY position ASC, id ASC`,
      [collectionId],
    );

    return result.rows.map(mapCollectionFolderRow);
  },

  async findFolderById(id: number): Promise<CollectionFolder | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<CollectionFolderRow>(
      `SELECT id, collection_id, parent_folder_id, name, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_FOLDERS_TABLE} WHERE id = ${token}`,
      [id],
    );

    const row = result.rows[0];
    return row ? mapCollectionFolderRow(row) : undefined;
  },

  async updateFolder(payload: {
    id: number;
    parentFolderId: number | null;
    name: string;
    position: number;
  }): Promise<void> {
    const idToken = resolveToken(1);
    const parentToken = resolveToken(2);
    const nameToken = resolveToken(3);
    const positionToken = resolveToken(4);

    await resolveDb().query(
      `UPDATE ${COLLECTION_FOLDERS_TABLE} SET parent_folder_id = ${parentToken}, name = ${nameToken}, position = ${positionToken}, updated_at = CURRENT_TIMESTAMP WHERE id = ${idToken}`,
      [payload.id, payload.parentFolderId, payload.name, payload.position],
    );
  },

  async deleteFolderById(id: number): Promise<void> {
    const token = resolveToken(1);
    await resolveDb().query(
      `DELETE FROM ${COLLECTION_FOLDERS_TABLE} WHERE id = ${token}`,
      [id],
    );
  },

  async createEndpointExample(payload: {
    endpointId: number;
    name: string;
    statusCode: number;
    headers: string;
    body: string | null;
    position: number;
    createdByUserId: number;
  }): Promise<CollectionEndpointExample> {
    const endpointToken = resolveToken(1);
    const nameToken = resolveToken(2);
    const statusToken = resolveToken(3);
    const headersToken = resolveToken(4);
    const bodyToken = resolveToken(5);
    const positionToken = resolveToken(6);
    const createdByToken = resolveToken(7);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<CollectionEndpointExampleRow>(
        `INSERT INTO ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} (endpoint_id, name, status_code, headers_json, body_text, position, created_by_user_id) VALUES (${endpointToken}, ${nameToken}, ${statusToken}, ${headersToken}, ${bodyToken}, ${positionToken}, ${createdByToken}) RETURNING id, endpoint_id, name, status_code, headers_json, body_text, position, created_by_user_id, created_at, updated_at`,
        [
          payload.endpointId,
          payload.name,
          payload.statusCode,
          payload.headers,
          payload.body,
          payload.position,
          payload.createdByUserId,
        ],
      );

      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create endpoint example");
      }

      return mapCollectionEndpointExampleRow(row);
    }

    await db.query(
      `INSERT INTO ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} (endpoint_id, name, status_code, headers_json, body_text, position, created_by_user_id) VALUES (${endpointToken}, ${nameToken}, ${statusToken}, ${headersToken}, ${bodyToken}, ${positionToken}, ${createdByToken})`,
      [
        payload.endpointId,
        payload.name,
        payload.statusCode,
        payload.headers,
        payload.body,
        payload.position,
        payload.createdByUserId,
      ],
    );

    const result = await db.query<CollectionEndpointExampleRow>(
      `SELECT id, endpoint_id, name, status_code, headers_json, body_text, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} WHERE endpoint_id = ${endpointToken} ORDER BY id DESC LIMIT 1`,
      [payload.endpointId],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create endpoint example");
    }

    return mapCollectionEndpointExampleRow(row);
  },

  async listExamplesByEndpoint(
    endpointId: number,
  ): Promise<CollectionEndpointExample[]> {
    const token = resolveToken(1);
    const result = await resolveDb().query<CollectionEndpointExampleRow>(
      `SELECT id, endpoint_id, name, status_code, headers_json, body_text, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} WHERE endpoint_id = ${token} ORDER BY position ASC, id ASC`,
      [endpointId],
    );

    return result.rows.map(mapCollectionEndpointExampleRow);
  },

  async findExampleById(
    id: number,
  ): Promise<CollectionEndpointExample | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<CollectionEndpointExampleRow>(
      `SELECT id, endpoint_id, name, status_code, headers_json, body_text, position, created_by_user_id, created_at, updated_at FROM ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} WHERE id = ${token}`,
      [id],
    );

    const row = result.rows[0];
    return row ? mapCollectionEndpointExampleRow(row) : undefined;
  },

  async updateExample(payload: {
    id: number;
    name: string;
    statusCode: number;
    headers: string;
    body: string | null;
    position: number;
  }): Promise<void> {
    const idToken = resolveToken(1);
    const nameToken = resolveToken(2);
    const statusToken = resolveToken(3);
    const headersToken = resolveToken(4);
    const bodyToken = resolveToken(5);
    const positionToken = resolveToken(6);

    await resolveDb().query(
      `UPDATE ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} SET name = ${nameToken}, status_code = ${statusToken}, headers_json = ${headersToken}, body_text = ${bodyToken}, position = ${positionToken}, updated_at = CURRENT_TIMESTAMP WHERE id = ${idToken}`,
      [
        payload.id,
        payload.name,
        payload.statusCode,
        payload.headers,
        payload.body,
        payload.position,
      ],
    );
  },

  async deleteExampleById(id: number): Promise<void> {
    const token = resolveToken(1);
    await resolveDb().query(
      `DELETE FROM ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} WHERE id = ${token}`,
      [id],
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
