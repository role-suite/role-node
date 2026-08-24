import type { MigrationContext } from "../src/types/db-migration.js";

const IMPORT_EXPORT_JOBS_TABLE = "import_export_jobs";
const WORKSPACES_TABLE = "workspaces";
const USERS_TABLE = "auth_users";

export const up = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${IMPORT_EXPORT_JOBS_TABLE} (
      id SERIAL PRIMARY KEY,
      workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      type VARCHAR(20) NOT NULL CHECK (type IN ('export', 'import')),
      status VARCHAR(30) NOT NULL CHECK (status IN ('completed')),
      format VARCHAR(20) NOT NULL CHECK (format IN ('json')),
      summary_json JSONB NOT NULL,
      artifact_json JSONB NOT NULL,
      created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP NOT NULL
    )
  `);

  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_import_export_jobs_workspace_created_at ON ${IMPORT_EXPORT_JOBS_TABLE}(workspace_id, created_at DESC)`,
  );
  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_import_export_jobs_workspace_type_created_at ON ${IMPORT_EXPORT_JOBS_TABLE}(workspace_id, type, created_at DESC)`,
  );
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${IMPORT_EXPORT_JOBS_TABLE}`);
};
