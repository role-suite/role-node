import type { MigrationContext } from "../src/types/db-migration.js";

const COLLECTIONS_TABLE = "collections";
const USERS_TABLE = "auth_users";
const COLLECTION_VERSIONS_TABLE = "collection_versions";

export const up = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${COLLECTION_VERSIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      collection_id INT NOT NULL REFERENCES ${COLLECTIONS_TABLE}(id) ON DELETE CASCADE,
      version_number INT NOT NULL,
      label VARCHAR(120) NULL,
      source VARCHAR(20) NOT NULL CHECK (source IN ('auto', 'manual', 'restore', 'import')),
      snapshot_json JSONB NOT NULL,
      created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      restored_from_version_id INT NULL REFERENCES ${COLLECTION_VERSIONS_TABLE}(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (collection_id, version_number)
    )
  `);

  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_collection_versions_collection_id ON ${COLLECTION_VERSIONS_TABLE}(collection_id, id DESC)`,
  );
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${COLLECTION_VERSIONS_TABLE}`);
};
