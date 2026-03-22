import { getDb } from "../../config/db.js";
import type { DatabaseClient } from "../../types/db.js";
import type {
  ExecutedRequestSnapshot,
  ExecutedResponseSnapshot,
  RunnerPublicError,
  StoredRun,
} from "../../internal/runner/core/types.js";

type RequestRunRow = {
  id: number;
  workspace_id: number;
  initiated_by_user_id: number;
  source_type: "adhoc" | "collection_endpoint";
  source_collection_id: number | null;
  source_endpoint_id: number | null;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  started_at: Date | string | null;
  completed_at: Date | string | null;
  duration_ms: number | null;
  error_code: string | null;
  error_message: string | null;
  error_json: string | null;
  created_at: Date | string;
};

type RequestRunRequestRow = {
  run_id: number;
  method: StoredRun["request"]["method"];
  url: string;
  headers_json: string;
  query_params_json: string;
  body_text: string | null;
  auth_json: string | null;
  resolved_variables_json: string;
  timeout_ms: number;
};

type RequestRunResponseRow = {
  run_id: number;
  status_code: number;
  headers_json: string;
  body_text: string | null;
  body_base64: string | null;
  size_bytes: number;
  truncated: boolean;
};

const REQUEST_RUNS_TABLE = "request_runs";
const REQUEST_RUN_REQUESTS_TABLE = "request_run_requests";
const REQUEST_RUN_RESPONSES_TABLE = "request_run_responses";

let dbOverride: DatabaseClient | null = null;

const resolveDb = (): DatabaseClient => {
  return dbOverride ?? getDb();
};

export const setRunsRepoDbClient = (dbClient: DatabaseClient | null): void => {
  dbOverride = dbClient;
};

const resolveToken = (index: number): string => {
  return resolveDb().dialect === "postgres" ? `$${index}` : "?";
};

const toDate = (value: Date | string | null): Date | null => {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value : new Date(value);
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

const parseRequestBodySnapshot = (
  value: string | null,
): ExecutedRequestSnapshot["body"] => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as ExecutedRequestSnapshot["body"];

    if (parsed && typeof parsed === "object" && "mode" in parsed) {
      return parsed;
    }
  } catch {
    return {
      mode: "raw",
      raw: value,
    };
  }

  return {
    mode: "raw",
    raw: value,
  };
};

const toStoredRun = (input: {
  run: RequestRunRow;
  request: RequestRunRequestRow;
  response?: RequestRunResponseRow;
}): StoredRun => {
  return {
    runId: input.run.id,
    workspaceId: input.run.workspace_id,
    initiatedByUserId: input.run.initiated_by_user_id,
    status:
      input.run.status === "queued"
        ? "running"
        : (input.run.status as StoredRun["status"]),
    startedAt: toDate(input.run.started_at) ?? new Date(input.run.created_at),
    completedAt: toDate(input.run.completed_at),
    durationMs: input.run.duration_ms,
    request: {
      method: input.request.method,
      url: input.request.url,
      headers: parseJson(input.request.headers_json, []),
      queryParams: parseJson(input.request.query_params_json, []),
      body: parseRequestBodySnapshot(input.request.body_text),
      auth: parseJson(input.request.auth_json, { type: "none" }),
      resolvedVariables: parseJson(input.request.resolved_variables_json, {}),
      timeoutMs: input.request.timeout_ms,
    },
    response: input.response
      ? {
          status: input.response.status_code,
          headers: parseJson<Record<string, string>>(
            input.response.headers_json,
            {},
          ),
          body: input.response.body_text,
          bodyBase64: input.response.body_base64,
          sizeBytes: input.response.size_bytes,
          truncated: input.response.truncated,
        }
      : null,
    error:
      input.run.error_code && input.run.error_message
        ? {
            code: input.run.error_code as RunnerPublicError["code"],
            message: input.run.error_message,
            ...(input.run.error_json
              ? {
                  details: parseJson<Record<string, unknown>>(
                    input.run.error_json,
                    {},
                  ),
                }
              : {}),
          }
        : null,
  };
};

const insertRequestSnapshot = async (
  db: DatabaseClient,
  payload: {
    runId: number;
    request: ExecutedRequestSnapshot;
  },
): Promise<void> => {
  const runIdToken = db.dialect === "postgres" ? "$1" : "?";
  const methodToken = db.dialect === "postgres" ? "$2" : "?";
  const urlToken = db.dialect === "postgres" ? "$3" : "?";
  const headersToken = db.dialect === "postgres" ? "$4" : "?";
  const queryToken = db.dialect === "postgres" ? "$5" : "?";
  const bodyToken = db.dialect === "postgres" ? "$6" : "?";
  const authToken = db.dialect === "postgres" ? "$7" : "?";
  const varsToken = db.dialect === "postgres" ? "$8" : "?";
  const timeoutToken = db.dialect === "postgres" ? "$9" : "?";

  await db.query(
    `INSERT INTO ${REQUEST_RUN_REQUESTS_TABLE} (run_id, method, url, headers_json, query_params_json, body_text, auth_json, resolved_variables_json, timeout_ms) VALUES (${runIdToken}, ${methodToken}, ${urlToken}, ${headersToken}, ${queryToken}, ${bodyToken}, ${authToken}, ${varsToken}, ${timeoutToken})`,
    [
      payload.runId,
      payload.request.method,
      payload.request.url,
      JSON.stringify(payload.request.headers),
      JSON.stringify(payload.request.queryParams),
      payload.request.body ? JSON.stringify(payload.request.body) : null,
      JSON.stringify(payload.request.auth),
      JSON.stringify(payload.request.resolvedVariables),
      payload.request.timeoutMs,
    ],
  );
};

const upsertResponseSnapshot = async (
  db: DatabaseClient,
  payload: {
    runId: number;
    response: ExecutedResponseSnapshot;
  },
): Promise<void> => {
  const runIdToken = db.dialect === "postgres" ? "$1" : "?";

  await db.query(
    `DELETE FROM ${REQUEST_RUN_RESPONSES_TABLE} WHERE run_id = ${runIdToken}`,
    [payload.runId],
  );

  const statusToken = db.dialect === "postgres" ? "$2" : "?";
  const headersToken = db.dialect === "postgres" ? "$3" : "?";
  const bodyToken = db.dialect === "postgres" ? "$4" : "?";
  const base64Token = db.dialect === "postgres" ? "$5" : "?";
  const sizeToken = db.dialect === "postgres" ? "$6" : "?";
  const truncatedToken = db.dialect === "postgres" ? "$7" : "?";

  await db.query(
    `INSERT INTO ${REQUEST_RUN_RESPONSES_TABLE} (run_id, status_code, headers_json, body_text, body_base64, size_bytes, truncated) VALUES (${runIdToken}, ${statusToken}, ${headersToken}, ${bodyToken}, ${base64Token}, ${sizeToken}, ${truncatedToken})`,
    [
      payload.runId,
      payload.response.status,
      JSON.stringify(payload.response.headers),
      payload.response.body,
      payload.response.bodyBase64,
      payload.response.sizeBytes,
      payload.response.truncated,
    ],
  );
};

const loadRunById = async (runId: number): Promise<StoredRun | undefined> => {
  const idToken = resolveToken(1);
  const runResult = await resolveDb().query<RequestRunRow>(
    `SELECT id, workspace_id, initiated_by_user_id, source_type, source_collection_id, source_endpoint_id, status, started_at, completed_at, duration_ms, error_code, error_message, error_json, created_at FROM ${REQUEST_RUNS_TABLE} WHERE id = ${idToken}`,
    [runId],
  );
  const run = runResult.rows[0];

  if (!run) {
    return undefined;
  }

  const requestResult = await resolveDb().query<RequestRunRequestRow>(
    `SELECT run_id, method, url, headers_json, query_params_json, body_text, auth_json, resolved_variables_json, timeout_ms FROM ${REQUEST_RUN_REQUESTS_TABLE} WHERE run_id = ${idToken}`,
    [runId],
  );
  const request = requestResult.rows[0];

  if (!request) {
    throw new Error(`Run request snapshot missing for run ${runId}`);
  }

  const responseResult = await resolveDb().query<RequestRunResponseRow>(
    `SELECT run_id, status_code, headers_json, body_text, body_base64, size_bytes, truncated FROM ${REQUEST_RUN_RESPONSES_TABLE} WHERE run_id = ${idToken}`,
    [runId],
  );

  const response = responseResult.rows[0];

  return toStoredRun({
    run,
    request,
    ...(response ? { response } : {}),
  });
};

export const runsRepo = {
  async createRunning(payload: {
    workspaceId: number;
    initiatedByUserId: number;
    sourceType: "adhoc" | "collection_endpoint";
    sourceCollectionId: number | null;
    sourceEndpointId: number | null;
    request: ExecutedRequestSnapshot;
    startedAt: Date;
  }): Promise<StoredRun> {
    const db = resolveDb();

    const runId = await db.transaction(async (tx) => {
      const workspaceToken = tx.dialect === "postgres" ? "$1" : "?";
      const userToken = tx.dialect === "postgres" ? "$2" : "?";
      const sourceTypeToken = tx.dialect === "postgres" ? "$3" : "?";
      const sourceCollectionToken = tx.dialect === "postgres" ? "$4" : "?";
      const sourceEndpointToken = tx.dialect === "postgres" ? "$5" : "?";
      const statusToken = tx.dialect === "postgres" ? "$6" : "?";
      const startedAtToken = tx.dialect === "postgres" ? "$7" : "?";

      if (tx.dialect === "postgres") {
        const inserted = await tx.query<{ id: number }>(
          `INSERT INTO ${REQUEST_RUNS_TABLE} (workspace_id, initiated_by_user_id, source_type, source_collection_id, source_endpoint_id, status, started_at) VALUES (${workspaceToken}, ${userToken}, ${sourceTypeToken}, ${sourceCollectionToken}, ${sourceEndpointToken}, ${statusToken}, ${startedAtToken}) RETURNING id`,
          [
            payload.workspaceId,
            payload.initiatedByUserId,
            payload.sourceType,
            payload.sourceCollectionId,
            payload.sourceEndpointId,
            "running",
            payload.startedAt,
          ],
        );

        const insertedId = inserted.rows[0]?.id;
        if (!insertedId) {
          throw new Error("Failed to create request run");
        }

        await insertRequestSnapshot(tx, {
          runId: insertedId,
          request: payload.request,
        });

        return insertedId;
      }

      await tx.query(
        `INSERT INTO ${REQUEST_RUNS_TABLE} (workspace_id, initiated_by_user_id, source_type, source_collection_id, source_endpoint_id, status, started_at) VALUES (${workspaceToken}, ${userToken}, ${sourceTypeToken}, ${sourceCollectionToken}, ${sourceEndpointToken}, ${statusToken}, ${startedAtToken})`,
        [
          payload.workspaceId,
          payload.initiatedByUserId,
          payload.sourceType,
          payload.sourceCollectionId,
          payload.sourceEndpointId,
          "running",
          payload.startedAt,
        ],
      );

      const latest = await tx.query<{ id: number }>(
        `SELECT id FROM ${REQUEST_RUNS_TABLE} WHERE workspace_id = ${workspaceToken} AND initiated_by_user_id = ${userToken} ORDER BY id DESC LIMIT 1`,
        [payload.workspaceId, payload.initiatedByUserId],
      );

      const insertedId = latest.rows[0]?.id;

      if (!insertedId) {
        throw new Error("Failed to create request run");
      }

      await insertRequestSnapshot(tx, {
        runId: insertedId,
        request: payload.request,
      });

      return insertedId;
    });

    const run = await loadRunById(runId);

    if (!run) {
      throw new Error("Failed to load created run");
    }

    return run;
  },

  async completeSuccess(
    runId: number,
    response: ExecutedResponseSnapshot,
  ): Promise<StoredRun> {
    const db = resolveDb();

    await db.transaction(async (tx) => {
      await upsertResponseSnapshot(tx, { runId, response });

      const idToken = tx.dialect === "postgres" ? "$1" : "?";
      const durationExpression =
        tx.dialect === "postgres"
          ? "EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at)) * 1000"
          : "TIMESTAMPDIFF(MICROSECOND, started_at, CURRENT_TIMESTAMP) DIV 1000";
      await tx.query(
        `UPDATE ${REQUEST_RUNS_TABLE} SET status = 'completed', completed_at = CURRENT_TIMESTAMP, duration_ms = ${durationExpression} WHERE id = ${idToken}`,
        [runId],
      );
    });

    const run = await loadRunById(runId);

    if (!run) {
      throw new Error("Run not found after completion");
    }

    return run;
  },

  async completeFailure(
    runId: number,
    error: RunnerPublicError,
  ): Promise<StoredRun> {
    const db = resolveDb();
    const isCancelled = error.code === "RUN_CANCELLED";

    await db.transaction(async (tx) => {
      const idToken = tx.dialect === "postgres" ? "$1" : "?";
      const codeToken = tx.dialect === "postgres" ? "$2" : "?";
      const messageToken = tx.dialect === "postgres" ? "$3" : "?";
      const detailsToken = tx.dialect === "postgres" ? "$4" : "?";
      const durationExpression =
        tx.dialect === "postgres"
          ? "EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at)) * 1000"
          : "TIMESTAMPDIFF(MICROSECOND, started_at, CURRENT_TIMESTAMP) DIV 1000";

      await tx.query(
        `UPDATE ${REQUEST_RUNS_TABLE} SET status = '${isCancelled ? "cancelled" : "failed"}', completed_at = CURRENT_TIMESTAMP, duration_ms = ${durationExpression}, error_code = ${codeToken}, error_message = ${messageToken}, error_json = ${detailsToken} WHERE id = ${idToken}`,
        [
          runId,
          error.code,
          error.message,
          JSON.stringify(error.details ?? null),
        ],
      );
    });

    const run = await loadRunById(runId);

    if (!run) {
      throw new Error("Run not found after failure update");
    }

    return run;
  },

  async findById(runId: number): Promise<StoredRun | undefined> {
    return loadRunById(runId);
  },

  async cancel(runId: number): Promise<StoredRun | undefined> {
    const existing = await loadRunById(runId);

    if (!existing) {
      return undefined;
    }

    if (existing.status !== "running") {
      return existing;
    }

    return this.completeFailure(runId, {
      code: "RUN_CANCELLED",
      message: "Run cancelled",
    });
  },
};
