import type { MigrationContext } from "../src/types/db-migration.js";

const REQUEST_RUNS_TABLE = "request_runs";
const REQUEST_RUN_REQUESTS_TABLE = "request_run_requests";
const REQUEST_RUN_RESPONSES_TABLE = "request_run_responses";
const WORKSPACES_TABLE = "workspaces";
const USERS_TABLE = "auth_users";
const COLLECTIONS_TABLE = "collections";
const COLLECTION_ENDPOINTS_TABLE = "collection_endpoints";

export const up = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${REQUEST_RUNS_TABLE} (
      id SERIAL PRIMARY KEY,
      workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      initiated_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      source_type VARCHAR(40) NOT NULL CHECK (source_type IN ('adhoc', 'collection_endpoint')),
      source_collection_id INT NULL REFERENCES ${COLLECTIONS_TABLE}(id) ON DELETE SET NULL,
      source_endpoint_id INT NULL REFERENCES ${COLLECTION_ENDPOINTS_TABLE}(id) ON DELETE SET NULL,
      status VARCHAR(40) NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
      started_at TIMESTAMP NULL,
      completed_at TIMESTAMP NULL,
      duration_ms INT NULL,
      error_code VARCHAR(120) NULL,
      error_message TEXT NULL,
      error_json JSONB NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${REQUEST_RUN_REQUESTS_TABLE} (
      id SERIAL PRIMARY KEY,
      run_id INT NOT NULL UNIQUE REFERENCES ${REQUEST_RUNS_TABLE}(id) ON DELETE CASCADE,
      method VARCHAR(16) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS')),
      url TEXT NOT NULL,
      headers_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      query_params_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      body_text TEXT NULL,
      auth_json JSONB NULL,
      resolved_variables_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      timeout_ms INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${REQUEST_RUN_RESPONSES_TABLE} (
      id SERIAL PRIMARY KEY,
      run_id INT NOT NULL UNIQUE REFERENCES ${REQUEST_RUNS_TABLE}(id) ON DELETE CASCADE,
      status_code INT NOT NULL,
      headers_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      body_text TEXT NULL,
      body_base64 TEXT NULL,
      size_bytes INT NOT NULL,
      truncated BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_request_runs_workspace_created_at ON ${REQUEST_RUNS_TABLE}(workspace_id, created_at DESC)`,
  );
  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_request_runs_workspace_status_created_at ON ${REQUEST_RUNS_TABLE}(workspace_id, status, created_at DESC)`,
  );
  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_request_runs_initiated_by_created_at ON ${REQUEST_RUNS_TABLE}(initiated_by_user_id, created_at DESC)`,
  );
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${REQUEST_RUN_RESPONSES_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${REQUEST_RUN_REQUESTS_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${REQUEST_RUNS_TABLE}`);
};
