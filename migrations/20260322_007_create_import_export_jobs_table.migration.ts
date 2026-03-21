import type { MigrationContext } from "../src/types/db-migration.js";

const IMPORT_EXPORT_JOBS_TABLE = "import_export_jobs";
const WORKSPACES_TABLE = "workspaces";
const USERS_TABLE = "auth_users";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ${IMPORT_EXPORT_JOBS_TABLE} (
        id SERIAL PRIMARY KEY,
        workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(30) NOT NULL,
        format VARCHAR(20) NOT NULL,
        summary_json TEXT NOT NULL,
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

    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${IMPORT_EXPORT_JOBS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      workspace_id INT NOT NULL,
      type VARCHAR(20) NOT NULL,
      status VARCHAR(30) NOT NULL,
      format VARCHAR(20) NOT NULL,
      summary_json TEXT NOT NULL,
      created_by_user_id INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP NOT NULL,
      INDEX idx_import_export_jobs_workspace_created_at (workspace_id, created_at),
      INDEX idx_import_export_jobs_workspace_type_created_at (workspace_id, type, created_at),
      CONSTRAINT fk_import_export_jobs_workspace FOREIGN KEY (workspace_id) REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_import_export_jobs_user FOREIGN KEY (created_by_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${IMPORT_EXPORT_JOBS_TABLE}`);
};
