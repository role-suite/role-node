import { scryptSync } from "node:crypto";

import { env } from "../src/config/env.js";
import { createDatabaseClient } from "../src/shared/db/client-factory.js";

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

const hashPasswordWithFixedSalt = (password: string, salt: string): string => {
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `scrypt$${salt}$${hash}`;
};

const validateEnvironment = (): void => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for demo seed");
  }

  if (env.DB_DIALECT !== "postgres") {
    throw new Error("Demo seed currently supports only DB_DIALECT=postgres");
  }

  const protocol = new URL(env.DATABASE_URL).protocol;

  if (protocol !== "postgres:" && protocol !== "postgresql:") {
    throw new Error(
      "DATABASE_URL must use postgres/postgresql protocol for demo seed",
    );
  }
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

      const passwordHash = hashPasswordWithFixedSalt(
        demoUser.password,
        demoUser.passwordSalt,
      );

      const createdUser = await tx.query<{ id: number }>(
        `INSERT INTO ${AUTH_USERS_TABLE} (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`,
        [demoUser.name, demoUser.email, passwordHash],
      );
      const userId = createdUser.rows[0]?.id;

      if (!userId) {
        throw new Error("Failed to create demo user");
      }

      const createdWorkspace = await tx.query<{ id: number }>(
        `INSERT INTO ${WORKSPACES_TABLE} (name, slug, type, created_by_user_id) VALUES ($1, $2, $3, $4) RETURNING id`,
        [demoWorkspace.name, demoWorkspace.slug, demoWorkspace.type, userId],
      );
      const workspaceId = createdWorkspace.rows[0]?.id;

      if (!workspaceId) {
        throw new Error("Failed to create demo workspace");
      }

      await tx.query(
        `INSERT INTO ${WORKSPACE_MEMBERSHIPS_TABLE} (user_id, workspace_id, role) VALUES ($1, $2, $3)`,
        [userId, workspaceId, "owner"],
      );

      const createdCollection = await tx.query<{ id: number }>(
        `INSERT INTO ${COLLECTIONS_TABLE} (workspace_id, name, description, created_by_user_id) VALUES ($1, $2, $3, $4) RETURNING id`,
        [
          workspaceId,
          "Demo API Collection",
          "Core endpoints used in live demo walkthroughs",
          userId,
        ],
      );
      const collectionId = createdCollection.rows[0]?.id;

      if (!collectionId) {
        throw new Error("Failed to create demo collection");
      }

      await tx.query(
        `INSERT INTO ${COLLECTION_ENDPOINTS_TABLE} (collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
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
        `INSERT INTO ${COLLECTION_ENDPOINTS_TABLE} (collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
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

      const createdEnvironment = await tx.query<{ id: number }>(
        `INSERT INTO ${ENVIRONMENTS_TABLE} (workspace_id, name, created_by_user_id) VALUES ($1, $2, $3) RETURNING id`,
        [workspaceId, "Demo", userId],
      );
      const environmentId = createdEnvironment.rows[0]?.id;

      if (!environmentId) {
        throw new Error("Failed to create demo environment");
      }

      await tx.query(
        `INSERT INTO ${ENVIRONMENT_VARIABLES_TABLE} (environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
        `INSERT INTO ${ENVIRONMENT_VARIABLES_TABLE} (environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
