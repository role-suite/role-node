import type { MigrationContext } from "../src/types/db-migration.js";

const ENVIRONMENTS_TABLE = "environments";
const USERS_TABLE = "auth_users";
const ENVIRONMENT_VARIABLES_TABLE = "environment_variables";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ${ENVIRONMENT_VARIABLES_TABLE} (
        id SERIAL PRIMARY KEY,
        environment_id INT NOT NULL REFERENCES ${ENVIRONMENTS_TABLE}(id) ON DELETE CASCADE,
        key_name VARCHAR(200) NOT NULL,
        value_text TEXT NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT TRUE,
        is_secret BOOLEAN NOT NULL DEFAULT FALSE,
        position INT NOT NULL DEFAULT 0,
        created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (environment_id, key_name)
      )
    `);

    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_environment_variables_environment_id ON ${ENVIRONMENT_VARIABLES_TABLE}(environment_id)`,
    );

    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${ENVIRONMENT_VARIABLES_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      environment_id INT NOT NULL,
      key_name VARCHAR(200) NOT NULL,
      value_text TEXT NOT NULL,
      enabled BOOLEAN NOT NULL DEFAULT TRUE,
      is_secret BOOLEAN NOT NULL DEFAULT FALSE,
      position INT NOT NULL DEFAULT 0,
      created_by_user_id INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_environment_variables_env_key (environment_id, key_name),
      INDEX idx_environment_variables_environment_id (environment_id),
      CONSTRAINT fk_environment_variables_environment FOREIGN KEY (environment_id) REFERENCES ${ENVIRONMENTS_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_environment_variables_user FOREIGN KEY (created_by_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${ENVIRONMENT_VARIABLES_TABLE}`);
};
