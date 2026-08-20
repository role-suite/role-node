import type { MigrationContext } from "../src/types/db-migration.js";

const WORKSPACES_TABLE = "workspaces";
const USERS_TABLE = "auth_users";
const COLLECTIONS_TABLE = "collections";

export const up = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${COLLECTIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      name VARCHAR(120) NOT NULL,
      description TEXT NULL,
      created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_collections_workspace_id ON ${COLLECTIONS_TABLE}(workspace_id)`,
  );
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${COLLECTIONS_TABLE}`);
};
