import type { MigrationContext } from "../src/types/db-migration.js";

const COLLECTIONS_TABLE = "collections";
const USERS_TABLE = "auth_users";
const COLLECTION_ENDPOINTS_TABLE = "collection_endpoints";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ${COLLECTION_ENDPOINTS_TABLE} (
        id SERIAL PRIMARY KEY,
        collection_id INT NOT NULL REFERENCES ${COLLECTIONS_TABLE}(id) ON DELETE CASCADE,
        name VARCHAR(120) NOT NULL,
        method VARCHAR(10) NOT NULL,
        url TEXT NOT NULL,
        headers_json TEXT NOT NULL,
        query_params_json TEXT NOT NULL,
        body_json TEXT NULL,
        auth_json TEXT NULL,
        position INT NOT NULL DEFAULT 0,
        created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_collection_endpoints_collection_id ON ${COLLECTION_ENDPOINTS_TABLE}(collection_id)`,
    );

    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${COLLECTION_ENDPOINTS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      collection_id INT NOT NULL,
      name VARCHAR(120) NOT NULL,
      method VARCHAR(10) NOT NULL,
      url TEXT NOT NULL,
      headers_json TEXT NOT NULL,
      query_params_json TEXT NOT NULL,
      body_json TEXT NULL,
      auth_json TEXT NULL,
      position INT NOT NULL DEFAULT 0,
      created_by_user_id INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_collection_endpoints_collection_id (collection_id),
      CONSTRAINT fk_collection_endpoints_collection FOREIGN KEY (collection_id) REFERENCES ${COLLECTIONS_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_collection_endpoints_user FOREIGN KEY (created_by_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${COLLECTION_ENDPOINTS_TABLE}`);
};
