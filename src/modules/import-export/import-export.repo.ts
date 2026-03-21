import { getDb } from "../../config/db.js";
import type { DatabaseClient } from "../../types/db.js";

export type ImportExportJobType = "export" | "import";
export type ImportExportJobStatus = "completed";

export type ImportExportJob = {
  id: number;
  workspaceId: number;
  type: ImportExportJobType;
  status: ImportExportJobStatus;
  format: "json";
  summary: Record<string, unknown>;
  createdByUserId: number;
  createdAt: Date;
  completedAt: Date;
};

type ImportExportJobRow = {
  id: number;
  workspace_id: number;
  type: ImportExportJobType;
  status: ImportExportJobStatus;
  format: "json";
  summary_json: string;
  created_by_user_id: number;
  created_at: Date | string;
  completed_at: Date | string;
};

const IMPORT_EXPORT_JOBS_TABLE = "import_export_jobs";

let dbOverride: DatabaseClient | null = null;

const resolveDb = (): DatabaseClient => {
  return dbOverride ?? getDb();
};

export const setImportExportRepoDbClient = (
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

const parseSummary = (value: string): Record<string, unknown> => {
  try {
    const parsed = JSON.parse(value) as unknown;

    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, unknown>;
    }

    return {};
  } catch {
    return {};
  }
};

const mapImportExportJobRow = (row: ImportExportJobRow): ImportExportJob => {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    type: row.type,
    status: row.status,
    format: row.format,
    summary: parseSummary(row.summary_json),
    createdByUserId: row.created_by_user_id,
    createdAt: toDate(row.created_at),
    completedAt: toDate(row.completed_at),
  };
};

export const importExportRepo = {
  async listByWorkspace(workspaceId: number): Promise<ImportExportJob[]> {
    const token = resolveToken(1);
    const result = await resolveDb().query<ImportExportJobRow>(
      `SELECT id, workspace_id, type, status, format, summary_json, created_by_user_id, created_at, completed_at FROM ${IMPORT_EXPORT_JOBS_TABLE} WHERE workspace_id = ${token} ORDER BY id DESC`,
      [workspaceId],
    );

    return result.rows.map(mapImportExportJobRow);
  },

  async findByWorkspaceAndId(
    workspaceId: number,
    jobId: number,
  ): Promise<ImportExportJob | undefined> {
    const workspaceToken = resolveToken(1);
    const idToken = resolveToken(2);
    const result = await resolveDb().query<ImportExportJobRow>(
      `SELECT id, workspace_id, type, status, format, summary_json, created_by_user_id, created_at, completed_at FROM ${IMPORT_EXPORT_JOBS_TABLE} WHERE workspace_id = ${workspaceToken} AND id = ${idToken}`,
      [workspaceId, jobId],
    );

    const row = result.rows[0];
    return row ? mapImportExportJobRow(row) : undefined;
  },

  async createJob(payload: {
    workspaceId: number;
    type: ImportExportJobType;
    format: "json";
    summary: Record<string, unknown>;
    createdByUserId: number;
  }): Promise<ImportExportJob> {
    const workspaceToken = resolveToken(1);
    const typeToken = resolveToken(2);
    const statusToken = resolveToken(3);
    const formatToken = resolveToken(4);
    const summaryToken = resolveToken(5);
    const createdByToken = resolveToken(6);
    const completedAtToken = resolveToken(7);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<ImportExportJobRow>(
        `INSERT INTO ${IMPORT_EXPORT_JOBS_TABLE} (workspace_id, type, status, format, summary_json, created_by_user_id, completed_at) VALUES (${workspaceToken}, ${typeToken}, ${statusToken}, ${formatToken}, ${summaryToken}, ${createdByToken}, ${completedAtToken}) RETURNING id, workspace_id, type, status, format, summary_json, created_by_user_id, created_at, completed_at`,
        [
          payload.workspaceId,
          payload.type,
          "completed",
          payload.format,
          JSON.stringify(payload.summary),
          payload.createdByUserId,
          new Date(),
        ],
      );

      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create import/export job");
      }

      return mapImportExportJobRow(row);
    }

    await db.query(
      `INSERT INTO ${IMPORT_EXPORT_JOBS_TABLE} (workspace_id, type, status, format, summary_json, created_by_user_id, completed_at) VALUES (${workspaceToken}, ${typeToken}, ${statusToken}, ${formatToken}, ${summaryToken}, ${createdByToken}, ${completedAtToken})`,
      [
        payload.workspaceId,
        payload.type,
        "completed",
        payload.format,
        JSON.stringify(payload.summary),
        payload.createdByUserId,
        new Date(),
      ],
    );

    const result = await db.query<ImportExportJobRow>(
      `SELECT id, workspace_id, type, status, format, summary_json, created_by_user_id, created_at, completed_at FROM ${IMPORT_EXPORT_JOBS_TABLE} WHERE workspace_id = ${workspaceToken} ORDER BY id DESC LIMIT 1`,
      [payload.workspaceId],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create import/export job");
    }

    return mapImportExportJobRow(row);
  },
};
