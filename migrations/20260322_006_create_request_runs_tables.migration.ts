import type { MigrationContext } from "../src/types/db-migration.js";

const REQUEST_RUNS_TABLE = "request_runs";
const REQUEST_RUN_REQUESTS_TABLE = "request_run_requests";
const REQUEST_RUN_RESPONSES_TABLE = "request_run_responses";
const WORKSPACES_TABLE = "workspaces";
const USERS_TABLE = "auth_users";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ${REQUEST_RUNS_TABLE} (
        id SERIAL PRIMARY KEY,
        workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
        initiated_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
        source_type VARCHAR(40) NOT NULL,
        source_collection_id INT NULL,
        source_endpoint_id INT NULL,
        status VARCHAR(40) NOT NULL,
        started_at TIMESTAMP NULL,
        completed_at TIMESTAMP NULL,
        duration_ms INT NULL,
        error_code VARCHAR(120) NULL,
        error_message TEXT NULL,
        error_json TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS ${REQUEST_RUN_REQUESTS_TABLE} (
        id SERIAL PRIMARY KEY,
        run_id INT NOT NULL UNIQUE REFERENCES ${REQUEST_RUNS_TABLE}(id) ON DELETE CASCADE,
        method VARCHAR(16) NOT NULL,
        url TEXT NOT NULL,
        headers_json TEXT NOT NULL,
        query_params_json TEXT NOT NULL,
        body_text TEXT NULL,
        auth_json TEXT NULL,
        resolved_variables_json TEXT NOT NULL,
        timeout_ms INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS ${REQUEST_RUN_RESPONSES_TABLE} (
        id SERIAL PRIMARY KEY,
        run_id INT NOT NULL UNIQUE REFERENCES ${REQUEST_RUNS_TABLE}(id) ON DELETE CASCADE,
        status_code INT NOT NULL,
        headers_json TEXT NOT NULL,
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

    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${REQUEST_RUNS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      workspace_id INT NOT NULL,
      initiated_by_user_id INT NOT NULL,
      source_type VARCHAR(40) NOT NULL,
      source_collection_id INT NULL,
      source_endpoint_id INT NULL,
      status VARCHAR(40) NOT NULL,
      started_at TIMESTAMP NULL,
      completed_at TIMESTAMP NULL,
      duration_ms INT NULL,
      error_code VARCHAR(120) NULL,
      error_message TEXT NULL,
      error_json TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_request_runs_workspace_created_at (workspace_id, created_at),
      INDEX idx_request_runs_workspace_status_created_at (workspace_id, status, created_at),
      INDEX idx_request_runs_initiated_by_created_at (initiated_by_user_id, created_at),
      CONSTRAINT fk_request_runs_workspace FOREIGN KEY (workspace_id) REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_request_runs_user FOREIGN KEY (initiated_by_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${REQUEST_RUN_REQUESTS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      run_id INT NOT NULL,
      method VARCHAR(16) NOT NULL,
      url TEXT NOT NULL,
      headers_json TEXT NOT NULL,
      query_params_json TEXT NOT NULL,
      body_text TEXT NULL,
      auth_json TEXT NULL,
      resolved_variables_json TEXT NOT NULL,
      timeout_ms INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_request_run_requests_run_id (run_id),
      CONSTRAINT fk_request_run_requests_run FOREIGN KEY (run_id) REFERENCES ${REQUEST_RUNS_TABLE}(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${REQUEST_RUN_RESPONSES_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      run_id INT NOT NULL,
      status_code INT NOT NULL,
      headers_json TEXT NOT NULL,
      body_text TEXT NULL,
      body_base64 TEXT NULL,
      size_bytes INT NOT NULL,
      truncated BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_request_run_responses_run_id (run_id),
      CONSTRAINT fk_request_run_responses_run FOREIGN KEY (run_id) REFERENCES ${REQUEST_RUNS_TABLE}(id) ON DELETE CASCADE
    )
  `);
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${REQUEST_RUN_RESPONSES_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${REQUEST_RUN_REQUESTS_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${REQUEST_RUNS_TABLE}`);
};
