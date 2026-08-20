import {
  Kysely,
  PostgresDialect,
  type ColumnType,
  type Generated,
} from "kysely";
import { Pool, type PoolConfig } from "pg";

import { env } from "./env.js";

type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>;
type NullableTimestamp = ColumnType<
  Date | null,
  Date | string | null | undefined,
  Date | string | null
>;
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type MembershipRole = "owner" | "admin" | "member";
type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type Database = {
  auth_users: {
    id: Generated<number>;
    name: string;
    email: string;
    password_hash: string;
    created_at: Timestamp;
  };
  workspaces: {
    id: Generated<number>;
    name: string;
    slug: string;
    type: "personal" | "team";
    created_by_user_id: number;
    created_at: Timestamp;
  };
  workspace_memberships: {
    id: Generated<number>;
    user_id: number;
    workspace_id: number;
    role: MembershipRole;
    created_at: Timestamp;
  };
  auth_sessions: {
    id: Generated<number>;
    user_id: number;
    workspace_id: number;
    refresh_token_hash: string;
    expires_at: Timestamp;
    revoked_at: NullableTimestamp;
    created_at: Timestamp;
  };
  workspace_invitations: {
    id: Generated<number>;
    workspace_id: number;
    invited_by_user_id: number;
    email: string;
    role: MembershipRole;
    token_hash: string;
    expires_at: Timestamp;
    accepted_at: NullableTimestamp;
    created_at: Timestamp;
  };
  workspace_events: {
    id: Generated<number>;
    workspace_id: number;
    actor_user_id: number;
    entity: string;
    action: string;
    entity_id: number | null;
    payload_json: JsonValue | null;
    created_at: Timestamp;
  };
  collections: {
    id: Generated<number>;
    workspace_id: number;
    name: string;
    description: string | null;
    created_by_user_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
  };
  collection_folders: {
    id: Generated<number>;
    collection_id: number;
    parent_folder_id: number | null;
    name: string;
    position: number;
    created_by_user_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
  };
  collection_endpoints: {
    id: Generated<number>;
    collection_id: number;
    folder_id: number | null;
    name: string;
    method: HttpMethod;
    url: string;
    headers_json: JsonValue;
    query_params_json: JsonValue;
    body_json: JsonValue | null;
    auth_json: JsonValue | null;
    position: number;
    created_by_user_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
  };
  collection_endpoint_examples: {
    id: Generated<number>;
    endpoint_id: number;
    name: string;
    status_code: number;
    headers_json: JsonValue;
    body_text: string | null;
    position: number;
    created_by_user_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
  };
  environments: {
    id: Generated<number>;
    workspace_id: number;
    name: string;
    created_by_user_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
  };
  environment_variables: {
    id: Generated<number>;
    environment_id: number;
    key_name: string;
    value_text: string;
    enabled: boolean;
    is_secret: boolean;
    position: number;
    created_by_user_id: number;
    created_at: Timestamp;
    updated_at: Timestamp;
  };
  request_runs: {
    id: Generated<number>;
    workspace_id: number;
    initiated_by_user_id: number;
    source_type: "adhoc" | "collection_endpoint";
    source_collection_id: number | null;
    source_endpoint_id: number | null;
    status: "queued" | "running" | "completed" | "failed" | "cancelled";
    started_at: NullableTimestamp;
    completed_at: NullableTimestamp;
    duration_ms: number | null;
    error_code: string | null;
    error_message: string | null;
    error_json: JsonValue | null;
    created_at: Timestamp;
  };
  request_run_requests: {
    id: Generated<number>;
    run_id: number;
    method: HttpMethod;
    url: string;
    headers_json: JsonValue;
    query_params_json: JsonValue;
    body_text: string | null;
    auth_json: JsonValue | null;
    resolved_variables_json: JsonValue;
    timeout_ms: number;
    created_at: Timestamp;
  };
  request_run_responses: {
    id: Generated<number>;
    run_id: number;
    status_code: number;
    headers_json: JsonValue;
    body_text: string | null;
    body_base64: string | null;
    size_bytes: number;
    truncated: boolean;
    created_at: Timestamp;
  };
  import_export_jobs: {
    id: Generated<number>;
    workspace_id: number;
    type: "export" | "import";
    status: "completed";
    format: "json";
    summary_json: JsonValue;
    created_by_user_id: number;
    created_at: Timestamp;
    completed_at: Timestamp;
  };
};

let kyselyDb: Kysely<Database> | null = null;

const resolvePoolConfig = (): PoolConfig => {
  const poolConfig: PoolConfig = {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
  };

  if (env.DB_SSL) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  return poolConfig;
};

export const getKyselyDb = (): Kysely<Database> => {
  if (!kyselyDb) {
    kyselyDb = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool(resolvePoolConfig()),
      }),
    });
  }

  return kyselyDb;
};

export const closeKyselyDb = async (): Promise<void> => {
  if (!kyselyDb) {
    return;
  }

  await kyselyDb.destroy();
  kyselyDb = null;
};
