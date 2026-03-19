import type { MigrationContext } from "../src/types/db-migration.js";

const USERS_TABLE = "auth_users";
const WORKSPACES_TABLE = "workspaces";
const MEMBERSHIPS_TABLE = "workspace_memberships";
const SESSIONS_TABLE = "auth_sessions";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
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
        type VARCHAR(20) NOT NULL,
        created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS ${MEMBERSHIPS_TABLE} (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
        workspace_id INT NOT NULL REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL,
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

    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${USERS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${WORKSPACES_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      slug VARCHAR(80) NOT NULL UNIQUE,
      type VARCHAR(20) NOT NULL,
      created_by_user_id INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_workspaces_user FOREIGN KEY (created_by_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${MEMBERSHIPS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      workspace_id INT NOT NULL,
      role VARCHAR(20) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_membership_user_workspace (user_id, workspace_id),
      CONSTRAINT fk_memberships_user FOREIGN KEY (user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_memberships_workspace FOREIGN KEY (workspace_id) REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${SESSIONS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      workspace_id INT NOT NULL,
      refresh_token_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      revoked_at TIMESTAMP NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_sessions_workspace FOREIGN KEY (workspace_id) REFERENCES ${WORKSPACES_TABLE}(id) ON DELETE CASCADE
    )
  `);
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${SESSIONS_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${MEMBERSHIPS_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${WORKSPACES_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${USERS_TABLE}`);
};
