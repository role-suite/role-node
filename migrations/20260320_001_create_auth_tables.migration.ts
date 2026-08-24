import type { MigrationContext } from "../src/types/db-migration.js";

const USERS_TABLE = "auth_users";
const WORKSPACES_TABLE = "workspaces";
const MEMBERSHIPS_TABLE = "workspace_memberships";
const SESSIONS_TABLE = "auth_sessions";

export const up = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${USERS_TABLE} (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${WORKSPACES_TABLE} (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      slug VARCHAR(80) NOT NULL UNIQUE,
      type VARCHAR(20) NOT NULL CHECK (type IN ('personal', 'team')),
      created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT workspaces_slug_not_blank CHECK (length(trim(slug)) > 0)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${MEMBERSHIPS_TABLE} (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, workspace_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${SESSIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
      refresh_token_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      revoked_at TIMESTAMP NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_workspace ON ${SESSIONS_TABLE}(user_id, workspace_id)`,
  );
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${SESSIONS_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${MEMBERSHIPS_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${WORKSPACES_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${USERS_TABLE}`);
};
