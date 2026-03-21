import type { MigrationContext } from "../src/types/db-migration.js";

const WORKSPACES_TABLE = "workspaces";
const USERS_TABLE = "auth_users";
const ENVIRONMENTS_TABLE = "environments";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ${ENVIRONMENTS_TABLE} (
        id SERIAL PRIMARY KEY,
        workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
        name VARCHAR(120) NOT NULL,
        created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (workspace_id, name)
      )
    `);

    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_environments_workspace_id ON ${ENVIRONMENTS_TABLE}(workspace_id)`,
    );

    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${ENVIRONMENTS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      workspace_id INT NOT NULL,
      name VARCHAR(120) NOT NULL,
      created_by_user_id INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_environments_workspace_name (workspace_id, name),
      INDEX idx_environments_workspace_id (workspace_id),
      CONSTRAINT fk_environments_workspace FOREIGN KEY (workspace_id) REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_environments_user FOREIGN KEY (created_by_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${ENVIRONMENTS_TABLE}`);
};
