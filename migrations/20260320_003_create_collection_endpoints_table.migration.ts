import type { MigrationContext } from "../src/types/db-migration.js";

const COLLECTIONS_TABLE = "collections";
const USERS_TABLE = "auth_users";
const COLLECTION_ENDPOINTS_TABLE = "collection_endpoints";

export const up = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${COLLECTION_ENDPOINTS_TABLE} (
      id SERIAL PRIMARY KEY,
      collection_id INT NOT NULL REFERENCES ${COLLECTIONS_TABLE}(id) ON DELETE CASCADE,
      name VARCHAR(120) NOT NULL,
      method VARCHAR(10) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS')),
      url TEXT NOT NULL,
      headers_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      query_params_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      body_json JSONB NULL,
      auth_json JSONB NULL,
      position INT NOT NULL DEFAULT 0,
      created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_collection_endpoints_collection_id ON ${COLLECTION_ENDPOINTS_TABLE}(collection_id)`,
  );
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${COLLECTION_ENDPOINTS_TABLE}`);
};
