import type { MigrationContext } from "../src/types/db-migration.js";

const WORKSPACE_EVENTS_TABLE = "workspace_events";
const WORKSPACES_TABLE = "workspaces";
const USERS_TABLE = "auth_users";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ${WORKSPACE_EVENTS_TABLE} (
        id SERIAL PRIMARY KEY,
        workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
        actor_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
        entity VARCHAR(60) NOT NULL,
        action VARCHAR(60) NOT NULL,
        entity_id INT NULL,
        payload_json TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_workspace_events_workspace_id_id ON ${WORKSPACE_EVENTS_TABLE}(workspace_id, id)`,
    );

    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${WORKSPACE_EVENTS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      workspace_id INT NOT NULL,
      actor_user_id INT NOT NULL,
      entity VARCHAR(60) NOT NULL,
      action VARCHAR(60) NOT NULL,
      entity_id INT NULL,
      payload_json TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_workspace_events_workspace_id_id (workspace_id, id),
      CONSTRAINT fk_workspace_events_workspace FOREIGN KEY (workspace_id) REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_workspace_events_actor FOREIGN KEY (actor_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${WORKSPACE_EVENTS_TABLE}`);
};
