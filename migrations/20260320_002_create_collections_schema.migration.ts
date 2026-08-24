import type { MigrationContext } from "../src/types/db-migration.js";

const WORKSPACES_TABLE = "workspaces";
const USERS_TABLE = "auth_users";
const COLLECTIONS_TABLE = "collections";
const COLLECTION_FOLDERS_TABLE = "collection_folders";
const COLLECTION_ENDPOINTS_TABLE = "collection_endpoints";
const COLLECTION_ENDPOINT_EXAMPLES_TABLE = "collection_endpoint_examples";

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

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${COLLECTION_FOLDERS_TABLE} (
      id SERIAL PRIMARY KEY,
      collection_id INT NOT NULL REFERENCES ${COLLECTIONS_TABLE}(id) ON DELETE CASCADE,
      parent_folder_id INT NULL REFERENCES ${COLLECTION_FOLDERS_TABLE}(id) ON DELETE CASCADE,
      name VARCHAR(120) NOT NULL,
      position INT NOT NULL DEFAULT 0,
      created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_collection_folders_collection_id ON ${COLLECTION_FOLDERS_TABLE}(collection_id)`,
  );
  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_collection_folders_parent_id ON ${COLLECTION_FOLDERS_TABLE}(parent_folder_id)`,
  );

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${COLLECTION_ENDPOINTS_TABLE} (
      id SERIAL PRIMARY KEY,
      collection_id INT NOT NULL REFERENCES ${COLLECTIONS_TABLE}(id) ON DELETE CASCADE,
      folder_id INT NULL REFERENCES ${COLLECTION_FOLDERS_TABLE}(id) ON DELETE SET NULL,
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
  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_collection_endpoints_folder_id ON ${COLLECTION_ENDPOINTS_TABLE}(folder_id)`,
  );

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} (
      id SERIAL PRIMARY KEY,
      endpoint_id INT NOT NULL REFERENCES ${COLLECTION_ENDPOINTS_TABLE}(id) ON DELETE CASCADE,
      name VARCHAR(120) NOT NULL,
      status_code INT NOT NULL DEFAULT 200,
      headers_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      body_text TEXT NULL,
      position INT NOT NULL DEFAULT 0,
      created_by_user_id INT NOT NULL REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(
    `CREATE INDEX IF NOT EXISTS idx_collection_endpoint_examples_endpoint_id ON ${COLLECTION_ENDPOINT_EXAMPLES_TABLE}(endpoint_id)`,
  );
};

export const down = async ({ db }: MigrationContext): Promise<void> => {
  await db.query(`DROP TABLE IF EXISTS ${COLLECTION_ENDPOINT_EXAMPLES_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${COLLECTION_ENDPOINTS_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${COLLECTION_FOLDERS_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${COLLECTIONS_TABLE}`);
};
