import type { MigrationContext } from "../src/types/db-migration.js";

const COLLECTIONS_TABLE = "collections";
const COLLECTION_ENDPOINTS_TABLE = "collection_endpoints";
const USERS_TABLE = "auth_users";
const COLLECTION_FOLDERS_TABLE = "collection_folders";
const COLLECTION_ENDPOINT_EXAMPLES_TABLE = "collection_endpoint_examples";

export const up = async ({ db, dialect }: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
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
      ALTER TABLE ${COLLECTION_ENDPOINTS_TABLE}
      ADD COLUMN IF NOT EXISTS folder_id INT NULL REFERENCES ${COLLECTION_FOLDERS_TABLE}(id) ON DELETE SET NULL
    `);

    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_collection_endpoints_folder_id ON ${COLLECTION_ENDPOINTS_TABLE}(folder_id)`,
    );

    await db.query(`
      CREATE TABLE IF NOT EXISTS ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} (
        id SERIAL PRIMARY KEY,
        endpoint_id INT NOT NULL REFERENCES ${COLLECTION_ENDPOINTS_TABLE}(id) ON DELETE CASCADE,
        name VARCHAR(120) NOT NULL,
        status_code INT NOT NULL DEFAULT 200,
        headers_json TEXT NOT NULL,
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

    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${COLLECTION_FOLDERS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      collection_id INT NOT NULL,
      parent_folder_id INT NULL,
      name VARCHAR(120) NOT NULL,
      position INT NOT NULL DEFAULT 0,
      created_by_user_id INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_collection_folders_collection_id (collection_id),
      INDEX idx_collection_folders_parent_id (parent_folder_id),
      CONSTRAINT fk_collection_folders_collection FOREIGN KEY (collection_id) REFERENCES ${COLLECTIONS_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_collection_folders_parent FOREIGN KEY (parent_folder_id) REFERENCES ${COLLECTION_FOLDERS_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_collection_folders_user FOREIGN KEY (created_by_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    ALTER TABLE ${COLLECTION_ENDPOINTS_TABLE}
    ADD COLUMN folder_id INT NULL,
    ADD CONSTRAINT fk_collection_endpoints_folder FOREIGN KEY (folder_id) REFERENCES ${COLLECTION_FOLDERS_TABLE}(id) ON DELETE SET NULL
  `);

  await db.query(
    `CREATE INDEX idx_collection_endpoints_folder_id ON ${COLLECTION_ENDPOINTS_TABLE}(folder_id)`,
  );

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${COLLECTION_ENDPOINT_EXAMPLES_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      endpoint_id INT NOT NULL,
      name VARCHAR(120) NOT NULL,
      status_code INT NOT NULL DEFAULT 200,
      headers_json TEXT NOT NULL,
      body_text TEXT NULL,
      position INT NOT NULL DEFAULT 0,
      created_by_user_id INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_collection_endpoint_examples_endpoint_id (endpoint_id),
      CONSTRAINT fk_collection_endpoint_examples_endpoint FOREIGN KEY (endpoint_id) REFERENCES ${COLLECTION_ENDPOINTS_TABLE}(id) ON DELETE CASCADE,
      CONSTRAINT fk_collection_endpoint_examples_user FOREIGN KEY (created_by_user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
    )
  `);
};

export const down = async ({
  db,
  dialect,
}: MigrationContext): Promise<void> => {
  if (dialect === "postgres") {
    await db.query(`DROP INDEX IF EXISTS idx_collection_endpoints_folder_id`);
    await db.query(
      `ALTER TABLE ${COLLECTION_ENDPOINTS_TABLE} DROP COLUMN IF EXISTS folder_id`,
    );
  } else {
    await db.query(
      `ALTER TABLE ${COLLECTION_ENDPOINTS_TABLE} DROP FOREIGN KEY fk_collection_endpoints_folder, DROP COLUMN folder_id`,
    );
    await db.query(
      `DROP INDEX idx_collection_endpoints_folder_id ON ${COLLECTION_ENDPOINTS_TABLE}`,
    );
  }

  await db.query(`DROP TABLE IF EXISTS ${COLLECTION_ENDPOINT_EXAMPLES_TABLE}`);
  await db.query(`DROP TABLE IF EXISTS ${COLLECTION_FOLDERS_TABLE}`);
};
