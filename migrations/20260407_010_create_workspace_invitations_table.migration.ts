import type { MigrationContext } from "../src/types/db-migration.js";

const USERS_TABLE = "auth_users";
const WORKSPACES_TABLE = "workspaces";
const INVITATIONS_TABLE = "workspace_invitations";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ${INVITATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
        invited_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        accepted_at TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${INVITATIONS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      workspace_id INT NOT NULL,
      invited_by_user_id INT NOT NULL,
      email VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      token_hash VARCHAR(255) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      accepted_at TIMESTAMP NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_invitations_workspace FOREIGN KEY (workspace_id) REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_invitations_user FOREIGN KEY (invited_by_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${INVITATIONS_TABLE}`);
};
