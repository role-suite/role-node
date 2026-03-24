import { scryptSync } from "node:crypto";

import { env } from "../src/config/env.js";
import { createDatabaseClient } from "../src/shared/db/client-factory.js";
import type {
  DatabaseClient,
  DbDialect,
  QueryParams,
} from "../src/types/db.js";

const AUTH_USERS_TABLE = "auth_users";
const WORKSPACES_TABLE = "workspaces";
const WORKSPACE_MEMBERSHIPS_TABLE = "workspace_memberships";
const AUTH_SESSIONS_TABLE = "auth_sessions";
const COLLECTIONS_TABLE = "collections";
const COLLECTION_FOLDERS_TABLE = "collection_folders";
const COLLECTION_ENDPOINTS_TABLE = "collection_endpoints";
const COLLECTION_ENDPOINT_EXAMPLES_TABLE = "collection_endpoint_examples";
const ENVIRONMENTS_TABLE = "environments";
const ENVIRONMENT_VARIABLES_TABLE = "environment_variables";
const REQUEST_RUNS_TABLE = "request_runs";
const REQUEST_RUN_REQUESTS_TABLE = "request_run_requests";
const REQUEST_RUN_RESPONSES_TABLE = "request_run_responses";
const IMPORT_EXPORT_JOBS_TABLE = "import_export_jobs";

const SCRYPT_KEY_LENGTH = 64;

const demoUser = {
  name: "Demo User",
  email: "demo@role.local",
  password: "DemoPass123!",
  passwordSalt: "role-demo-fixed-salt",
};

const demoWorkspace = {
  name: "Role Demo Workspace",
  slug: "role-demo-workspace",
  type: "team" as const,
};

const allDemoTables = [
  AUTH_SESSIONS_TABLE,
  WORKSPACE_MEMBERSHIPS_TABLE,
  COLLECTION_ENDPOINT_EXAMPLES_TABLE,
  COLLECTION_ENDPOINTS_TABLE,
  COLLECTION_FOLDERS_TABLE,
  COLLECTIONS_TABLE,
  ENVIRONMENT_VARIABLES_TABLE,
  ENVIRONMENTS_TABLE,
  REQUEST_RUN_REQUESTS_TABLE,
  REQUEST_RUN_RESPONSES_TABLE,
  REQUEST_RUNS_TABLE,
  IMPORT_EXPORT_JOBS_TABLE,
  WORKSPACES_TABLE,
  AUTH_USERS_TABLE,
] as const;

const hashPasswordWithFixedSalt = (password: string, salt: string): string => {
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `scrypt$${salt}$${hash}`;
};

const isPostgres = (dialect: DbDialect): boolean => {
  return dialect === "postgres";
};

const paramToken = (dialect: DbDialect, index: number): string => {
  return isPostgres(dialect) ? `$${index}` : "?";
};

const buildInsertSql = (
  dialect: DbDialect,
  table: string,
  columns: readonly string[],
  withReturningId = false,
): string => {
  const valuesSql = columns
    .map((_, index) => paramToken(dialect, index + 1))
    .join(", ");
  const returningSql =
    withReturningId && isPostgres(dialect) ? " RETURNING id" : "";
  return `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${valuesSql})${returningSql}`;
};

const insertAndGetId = async (
  tx: DatabaseClient,
  table: string,
  columns: readonly string[],
  values: QueryParams,
): Promise<number> => {
  if (isPostgres(tx.dialect)) {
    const inserted = await tx.query<{ id: number }>(
      buildInsertSql(tx.dialect, table, columns, true),
      values,
    );
    const id = inserted.rows[0]?.id;

    if (!id) {
      throw new Error(`Failed to insert row into ${table}`);
    }

    return id;
  }

  await tx.query(buildInsertSql(tx.dialect, table, columns), values);
  const idResult = await tx.query<{ id: number }>(
    "SELECT LAST_INSERT_ID() AS id",
  );
  const id = idResult.rows[0]?.id;

  if (!id) {
    throw new Error(`Failed to read inserted id from ${table}`);
  }

  return id;
};

const resetDemoData = async (tx: DatabaseClient): Promise<void> => {
  if (isPostgres(tx.dialect)) {
    await tx.query(
      `TRUNCATE TABLE
        ${AUTH_SESSIONS_TABLE},
        ${WORKSPACE_MEMBERSHIPS_TABLE},
        ${COLLECTION_ENDPOINT_EXAMPLES_TABLE},
        ${COLLECTION_ENDPOINTS_TABLE},
        ${COLLECTION_FOLDERS_TABLE},
        ${COLLECTIONS_TABLE},
        ${ENVIRONMENT_VARIABLES_TABLE},
        ${ENVIRONMENTS_TABLE},
        ${REQUEST_RUN_REQUESTS_TABLE},
        ${REQUEST_RUN_RESPONSES_TABLE},
        ${REQUEST_RUNS_TABLE},
        ${IMPORT_EXPORT_JOBS_TABLE},
        ${WORKSPACES_TABLE},
        ${AUTH_USERS_TABLE}
       RESTART IDENTITY CASCADE`,
    );
    return;
  }

  await tx.query("SET FOREIGN_KEY_CHECKS = 0");

  try {
    for (const table of allDemoTables) {
      await tx.query(`DELETE FROM ${table}`);
    }

    for (const table of allDemoTables) {
      await tx.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
    }
  } finally {
    await tx.query("SET FOREIGN_KEY_CHECKS = 1");
  }
};

const validateEnvironment = (): void => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for demo seed");
  }

  const protocol = new URL(env.DATABASE_URL).protocol;

  if (env.DB_DIALECT === "postgres") {
    if (protocol !== "postgres:" && protocol !== "postgresql:") {
      throw new Error(
        "DATABASE_URL must use postgres/postgresql protocol when DB_DIALECT=postgres",
      );
    }

    return;
  }

  if (env.DB_DIALECT === "mysql" || env.DB_DIALECT === "mariadb") {
    if (protocol !== "mysql:") {
      throw new Error(
        "DATABASE_URL must use mysql protocol when DB_DIALECT=mysql|mariadb",
      );
    }

    return;
  }

  throw new Error("Demo seed supports DB_DIALECT=postgres|mysql|mariadb");
};

const run = async (): Promise<void> => {
  validateEnvironment();

  const db = createDatabaseClient(env.DB_DIALECT, {
    connectionString: env.DATABASE_URL!,
    poolMin: env.DB_POOL_MIN,
    poolMax: env.DB_POOL_MAX,
    ssl: env.DB_SSL,
  });

  try {
    const result = await db.transaction(async (tx) => {
      await resetDemoData(tx);

      const passwordHash = hashPasswordWithFixedSalt(
        demoUser.password,
        demoUser.passwordSalt,
      );

      const userId = await insertAndGetId(
        tx,
        AUTH_USERS_TABLE,
        ["name", "email", "password_hash"],
        [demoUser.name, demoUser.email, passwordHash],
      );

      const workspaceId = await insertAndGetId(
        tx,
        WORKSPACES_TABLE,
        ["name", "slug", "type", "created_by_user_id"],
        [demoWorkspace.name, demoWorkspace.slug, demoWorkspace.type, userId],
      );

      await tx.query(
        buildInsertSql(tx.dialect, WORKSPACE_MEMBERSHIPS_TABLE, [
          "user_id",
          "workspace_id",
          "role",
        ]),
        [userId, workspaceId, "owner"],
      );

      const collectionId = await insertAndGetId(
        tx,
        COLLECTIONS_TABLE,
        ["workspace_id", "name", "description", "created_by_user_id"],
        [
          workspaceId,
          "Demo API Collection",
          "Core endpoints used in live demo walkthroughs",
          userId,
        ],
      );

      await tx.query(
        buildInsertSql(tx.dialect, COLLECTION_ENDPOINTS_TABLE, [
          "collection_id",
          "folder_id",
          "name",
          "method",
          "url",
          "headers_json",
          "query_params_json",
          "body_json",
          "auth_json",
          "position",
          "created_by_user_id",
        ]),
        [
          collectionId,
          null,
          "Get Products",
          "GET",
          "https://api.demo.role.local/products",
          JSON.stringify([{ key: "Accept", value: "application/json" }]),
          JSON.stringify([{ key: "limit", value: "20" }]),
          null,
          null,
          0,
          userId,
        ],
      );

      await tx.query(
        buildInsertSql(tx.dialect, COLLECTION_ENDPOINTS_TABLE, [
          "collection_id",
          "folder_id",
          "name",
          "method",
          "url",
          "headers_json",
          "query_params_json",
          "body_json",
          "auth_json",
          "position",
          "created_by_user_id",
        ]),
        [
          collectionId,
          null,
          "Create Order",
          "POST",
          "https://api.demo.role.local/orders",
          JSON.stringify([
            { key: "Content-Type", value: "application/json" },
            { key: "X-Api-Key", value: "{{API_KEY}}" },
          ]),
          JSON.stringify([]),
          JSON.stringify({ productId: "sku_demo_1", quantity: 2 }),
          null,
          1,
          userId,
        ],
      );

      const environmentId = await insertAndGetId(
        tx,
        ENVIRONMENTS_TABLE,
        ["workspace_id", "name", "created_by_user_id"],
        [workspaceId, "Demo", userId],
      );

      await tx.query(
        buildInsertSql(tx.dialect, ENVIRONMENT_VARIABLES_TABLE, [
          "environment_id",
          "key_name",
          "value_text",
          "enabled",
          "is_secret",
          "position",
          "created_by_user_id",
        ]),
        [
          environmentId,
          "BASE_URL",
          "https://api.demo.role.local",
          true,
          false,
          0,
          userId,
        ],
      );

      await tx.query(
        buildInsertSql(tx.dialect, ENVIRONMENT_VARIABLES_TABLE, [
          "environment_id",
          "key_name",
          "value_text",
          "enabled",
          "is_secret",
          "position",
          "created_by_user_id",
        ]),
        [environmentId, "API_KEY", "demo-api-key-123", true, true, 1, userId],
      );

      return {
        userId,
        workspaceId,
        collectionId,
        environmentId,
      };
    });

    console.log("Demo seed completed successfully");
    console.log(
      JSON.stringify(
        {
          dialect: env.DB_DIALECT,
          user: {
            id: result.userId,
            email: demoUser.email,
            password: demoUser.password,
          },
          workspace: {
            id: result.workspaceId,
            slug: demoWorkspace.slug,
          },
          collectionId: result.collectionId,
          environmentId: result.environmentId,
        },
        null,
        2,
      ),
    );
  } finally {
    await db.close();
  }
};

run().catch((error) => {
  console.error("Demo seed failed", error);
  process.exit(1);
});
