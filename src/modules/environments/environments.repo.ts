import { getDb } from "../../config/db.js";
import type { DatabaseClient } from "../../types/db.js";

export type Environment = {
  id: number;
  workspaceId: number;
  name: string;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type EnvironmentVariable = {
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

type EnvironmentRow = {
  id: number;
  workspace_id: number;
  name: string;
  created_by_user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
};

type EnvironmentVariableRow = {
  id: number;
  environment_id: number;
  key_name: string;
  value_text: string;
  enabled: boolean;
  is_secret: boolean;
  position: number;
  created_by_user_id: number;
  created_at: Date | string;
  updated_at: Date | string;
};

const ENVIRONMENTS_TABLE = "environments";
const ENVIRONMENT_VARIABLES_TABLE = "environment_variables";

let dbOverride: DatabaseClient | null = null;

const resolveDb = (): DatabaseClient => {
  return dbOverride ?? getDb();
};

export const setEnvironmentsRepoDbClient = (
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

const mapEnvironmentRow = (row: EnvironmentRow): Environment => {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    name: row.name,
    createdByUserId: row.created_by_user_id,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
};

const mapEnvironmentVariableRow = (
  row: EnvironmentVariableRow,
): EnvironmentVariable => {
  return {
    id: row.id,
    environmentId: row.environment_id,
    key: row.key_name,
    value: row.value_text,
    enabled: row.enabled,
    isSecret: row.is_secret,
    position: row.position,
    createdByUserId: row.created_by_user_id,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
};

export const environmentsRepo = {
  async createEnvironment(payload: {
    workspaceId: number;
    name: string;
    createdByUserId: number;
  }): Promise<Environment> {
    const workspaceToken = resolveToken(1);
    const nameToken = resolveToken(2);
    const createdByToken = resolveToken(3);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<EnvironmentRow>(
        `INSERT INTO ${ENVIRONMENTS_TABLE} (workspace_id, name, created_by_user_id) VALUES (${workspaceToken}, ${nameToken}, ${createdByToken}) RETURNING id, workspace_id, name, created_by_user_id, created_at, updated_at`,
        [payload.workspaceId, payload.name, payload.createdByUserId],
      );
      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create environment");
      }

      return mapEnvironmentRow(row);
    }

    await db.query(
      `INSERT INTO ${ENVIRONMENTS_TABLE} (workspace_id, name, created_by_user_id) VALUES (${workspaceToken}, ${nameToken}, ${createdByToken})`,
      [payload.workspaceId, payload.name, payload.createdByUserId],
    );

    const result = await db.query<EnvironmentRow>(
      `SELECT id, workspace_id, name, created_by_user_id, created_at, updated_at FROM ${ENVIRONMENTS_TABLE} WHERE workspace_id = ${workspaceToken} ORDER BY id DESC LIMIT 1`,
      [payload.workspaceId],
    );
    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create environment");
    }

    return mapEnvironmentRow(row);
  },

  async listEnvironmentsByWorkspace(
    workspaceId: number,
  ): Promise<Environment[]> {
    const token = resolveToken(1);
    const result = await resolveDb().query<EnvironmentRow>(
      `SELECT id, workspace_id, name, created_by_user_id, created_at, updated_at FROM ${ENVIRONMENTS_TABLE} WHERE workspace_id = ${token} ORDER BY id ASC`,
      [workspaceId],
    );

    return result.rows.map(mapEnvironmentRow);
  },

  async findEnvironmentById(id: number): Promise<Environment | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<EnvironmentRow>(
      `SELECT id, workspace_id, name, created_by_user_id, created_at, updated_at FROM ${ENVIRONMENTS_TABLE} WHERE id = ${token}`,
      [id],
    );
    const row = result.rows[0];
    return row ? mapEnvironmentRow(row) : undefined;
  },

  async findEnvironmentByWorkspaceAndName(
    workspaceId: number,
    name: string,
  ): Promise<Environment | undefined> {
    const workspaceToken = resolveToken(1);
    const nameToken = resolveToken(2);
    const result = await resolveDb().query<EnvironmentRow>(
      `SELECT id, workspace_id, name, created_by_user_id, created_at, updated_at FROM ${ENVIRONMENTS_TABLE} WHERE workspace_id = ${workspaceToken} AND name = ${nameToken}`,
      [workspaceId, name],
    );
    const row = result.rows[0];
    return row ? mapEnvironmentRow(row) : undefined;
  },

  async updateEnvironment(payload: {
    id: number;
    name: string;
  }): Promise<void> {
    const idToken = resolveToken(1);
    const nameToken = resolveToken(2);
    await resolveDb().query(
      `UPDATE ${ENVIRONMENTS_TABLE} SET name = ${nameToken}, updated_at = CURRENT_TIMESTAMP WHERE id = ${idToken}`,
      [payload.id, payload.name],
    );
  },

  async deleteEnvironmentById(id: number): Promise<void> {
    const token = resolveToken(1);
    await resolveDb().query(
      `DELETE FROM ${ENVIRONMENTS_TABLE} WHERE id = ${token}`,
      [id],
    );
  },

  async createVariable(payload: {
    environmentId: number;
    key: string;
    value: string;
    enabled: boolean;
    isSecret: boolean;
    position: number;
    createdByUserId: number;
  }): Promise<EnvironmentVariable> {
    const environmentToken = resolveToken(1);
    const keyToken = resolveToken(2);
    const valueToken = resolveToken(3);
    const enabledToken = resolveToken(4);
    const secretToken = resolveToken(5);
    const positionToken = resolveToken(6);
    const createdByToken = resolveToken(7);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<EnvironmentVariableRow>(
        `INSERT INTO ${ENVIRONMENT_VARIABLES_TABLE} (environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id) VALUES (${environmentToken}, ${keyToken}, ${valueToken}, ${enabledToken}, ${secretToken}, ${positionToken}, ${createdByToken}) RETURNING id, environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id, created_at, updated_at`,
        [
          payload.environmentId,
          payload.key,
          payload.value,
          payload.enabled,
          payload.isSecret,
          payload.position,
          payload.createdByUserId,
        ],
      );
      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create environment variable");
      }

      return mapEnvironmentVariableRow(row);
    }

    await db.query(
      `INSERT INTO ${ENVIRONMENT_VARIABLES_TABLE} (environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id) VALUES (${environmentToken}, ${keyToken}, ${valueToken}, ${enabledToken}, ${secretToken}, ${positionToken}, ${createdByToken})`,
      [
        payload.environmentId,
        payload.key,
        payload.value,
        payload.enabled,
        payload.isSecret,
        payload.position,
        payload.createdByUserId,
      ],
    );

    const result = await db.query<EnvironmentVariableRow>(
      `SELECT id, environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id, created_at, updated_at FROM ${ENVIRONMENT_VARIABLES_TABLE} WHERE environment_id = ${environmentToken} ORDER BY id DESC LIMIT 1`,
      [payload.environmentId],
    );
    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create environment variable");
    }

    return mapEnvironmentVariableRow(row);
  },

  async listVariablesByEnvironment(
    environmentId: number,
  ): Promise<EnvironmentVariable[]> {
    const token = resolveToken(1);
    const result = await resolveDb().query<EnvironmentVariableRow>(
      `SELECT id, environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id, created_at, updated_at FROM ${ENVIRONMENT_VARIABLES_TABLE} WHERE environment_id = ${token} ORDER BY position ASC, id ASC`,
      [environmentId],
    );

    return result.rows.map(mapEnvironmentVariableRow);
  },

  async findVariableById(id: number): Promise<EnvironmentVariable | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<EnvironmentVariableRow>(
      `SELECT id, environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id, created_at, updated_at FROM ${ENVIRONMENT_VARIABLES_TABLE} WHERE id = ${token}`,
      [id],
    );
    const row = result.rows[0];
    return row ? mapEnvironmentVariableRow(row) : undefined;
  },

  async findVariableByEnvironmentAndKey(
    environmentId: number,
    key: string,
  ): Promise<EnvironmentVariable | undefined> {
    const environmentToken = resolveToken(1);
    const keyToken = resolveToken(2);
    const result = await resolveDb().query<EnvironmentVariableRow>(
      `SELECT id, environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id, created_at, updated_at FROM ${ENVIRONMENT_VARIABLES_TABLE} WHERE environment_id = ${environmentToken} AND key_name = ${keyToken}`,
      [environmentId, key],
    );
    const row = result.rows[0];
    return row ? mapEnvironmentVariableRow(row) : undefined;
  },

  async updateVariable(payload: {
    id: number;
    key: string;
    value: string;
    enabled: boolean;
    isSecret: boolean;
    position: number;
  }): Promise<void> {
    const idToken = resolveToken(1);
    const keyToken = resolveToken(2);
    const valueToken = resolveToken(3);
    const enabledToken = resolveToken(4);
    const secretToken = resolveToken(5);
    const positionToken = resolveToken(6);
    await resolveDb().query(
      `UPDATE ${ENVIRONMENT_VARIABLES_TABLE} SET key_name = ${keyToken}, value_text = ${valueToken}, enabled = ${enabledToken}, is_secret = ${secretToken}, position = ${positionToken}, updated_at = CURRENT_TIMESTAMP WHERE id = ${idToken}`,
      [
        payload.id,
        payload.key,
        payload.value,
        payload.enabled,
        payload.isSecret,
        payload.position,
      ],
    );
  },

  async deleteVariableById(id: number): Promise<void> {
    const token = resolveToken(1);
    await resolveDb().query(
      `DELETE FROM ${ENVIRONMENT_VARIABLES_TABLE} WHERE id = ${token}`,
      [id],
    );
  },
};
