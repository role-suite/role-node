import type {
  DatabaseClient,
  QueryParams,
  QueryResult,
  QueryRow,
} from "../../src/types/db.js";

type AuthUserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
};

type WorkspaceRow = {
  id: number;
  name: string;
  slug: string;
  type: "personal" | "team";
  created_by_user_id: number;
  created_at: Date;
};

type MembershipRow = {
  id: number;
  user_id: number;
  workspace_id: number;
  role: "owner" | "admin" | "member";
  created_at: Date;
};

type SessionRow = {
  id: number;
  user_id: number;
  workspace_id: number;
  refresh_token_hash: string;
  expires_at: Date;
  revoked_at: Date | null;
  created_at: Date;
};

type CollectionRow = {
  id: number;
  workspace_id: number;
  name: string;
  description: string | null;
  created_by_user_id: number;
  created_at: Date;
  updated_at: Date;
};

type CollectionEndpointRow = {
  id: number;
  collection_id: number;
  folder_id: number | null;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  url: string;
  headers_json: string;
  query_params_json: string;
  body_json: string | null;
  auth_json: string | null;
  position: number;
  created_by_user_id: number;
  created_at: Date;
  updated_at: Date;
};

type CollectionFolderRow = {
  id: number;
  collection_id: number;
  parent_folder_id: number | null;
  name: string;
  position: number;
  created_by_user_id: number;
  created_at: Date;
  updated_at: Date;
};

type CollectionEndpointExampleRow = {
  id: number;
  endpoint_id: number;
  name: string;
  status_code: number;
  headers_json: string;
  body_text: string | null;
  position: number;
  created_by_user_id: number;
  created_at: Date;
  updated_at: Date;
};

type EnvironmentRow = {
  id: number;
  workspace_id: number;
  name: string;
  created_by_user_id: number;
  created_at: Date;
  updated_at: Date;
};

type EnvironmentVariableRow = {
  id: number;
  environment_id: number;
  key_name: string;
  value_text: string;
  enabled: boolean;
  is_secret: boolean;
  position: number;
  created_by_user_id: number;
  created_at: Date;
  updated_at: Date;
};

type ImportExportJobRow = {
  id: number;
  workspace_id: number;
  type: "export" | "import";
  status: "completed";
  format: "json";
  summary_json: string;
  artifact_json: string;
  created_by_user_id: number;
  created_at: Date;
  completed_at: Date;
};

type WorkspaceEventRow = {
  id: number;
  workspace_id: number;
  actor_user_id: number;
  entity: string;
  action: string;
  entity_id: number | null;
  payload_json: string | null;
  created_at: Date;
};

type WorkspaceInvitationRow = {
  id: number;
  workspace_id: number;
  invited_by_user_id: number;
  email: string;
  role: "owner" | "admin" | "member";
  token_hash: string;
  expires_at: Date;
  accepted_at: Date | null;
  created_at: Date;
};

const normalizeSql = (sql: string): string => {
  return sql.replace(/\s+/g, " ").trim().toLowerCase();
};

const castRows = <TRow extends QueryRow>(rows: unknown[]): TRow[] => {
  return rows as unknown as TRow[];
};

const expectParam = <T>(params: QueryParams, index: number): T => {
  const value = params[index];

  if (value === undefined) {
    throw new Error(`Missing SQL parameter at index ${index}`);
  }

  return value as T;
};

export const createAuthTestDb = (): DatabaseClient => {
  let userId = 1;
  let workspaceId = 1;
  let membershipId = 1;
  let sessionId = 1;

  let users: AuthUserRow[] = [];
  let workspaces: WorkspaceRow[] = [];
  let memberships: MembershipRow[] = [];
  let sessions: SessionRow[] = [];
  let collections: CollectionRow[] = [];
  let collectionEndpoints: CollectionEndpointRow[] = [];
  let collectionFolders: CollectionFolderRow[] = [];
  let collectionEndpointExamples: CollectionEndpointExampleRow[] = [];
  let collectionFolderId = 1;
  let collectionEndpointExampleId = 1;
  let environments: EnvironmentRow[] = [];
  let environmentVariables: EnvironmentVariableRow[] = [];
  let importExportJobs: ImportExportJobRow[] = [];
  let workspaceEvents: WorkspaceEventRow[] = [];
  let workspaceInvitations: WorkspaceInvitationRow[] = [];
  let collectionId = 1;
  let collectionEndpointId = 1;
  let environmentId = 1;
  let environmentVariableId = 1;
  let importExportJobId = 1;
  let workspaceEventId = 1;
  let workspaceInvitationId = 1;

  const query = async <TRow extends QueryRow = QueryRow>(
    sql: string,
    params: QueryParams = [],
  ): Promise<QueryResult<TRow>> => {
    const normalized = normalizeSql(sql);

    if (
      normalized.startsWith(
        "truncate table workspace_events, workspace_invitations, auth_sessions, workspace_memberships, workspaces, auth_users",
      )
    ) {
      users = [];
      workspaces = [];
      memberships = [];
      sessions = [];
      collections = [];
      collectionEndpoints = [];
      collectionFolders = [];
      collectionEndpointExamples = [];
      environments = [];
      environmentVariables = [];
      importExportJobs = [];
      workspaceEvents = [];
      workspaceInvitations = [];
      userId = 1;
      workspaceId = 1;
      membershipId = 1;
      sessionId = 1;
      collectionId = 1;
      collectionEndpointId = 1;
      environmentId = 1;
      environmentVariableId = 1;
      importExportJobId = 1;
      workspaceEventId = 1;
      workspaceInvitationId = 1;
      return { rows: [] as TRow[], rowCount: 0 };
    }

    if (
      normalized.startsWith("insert into workspace_events") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: WorkspaceEventRow = {
        id: workspaceEventId++,
        workspace_id: expectParam<number>(params, 0),
        actor_user_id: expectParam<number>(params, 1),
        entity: expectParam<string>(params, 2),
        action: expectParam<string>(params, 3),
        entity_id: expectParam<number | null>(params, 4),
        payload_json: expectParam<string | null>(params, 5),
        created_at: now,
      };
      workspaceEvents.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, actor_user_id, entity, action, entity_id, payload_json, created_at from workspace_events where workspace_id =",
      ) &&
      normalized.includes("and id >")
    ) {
      const workspace = expectParam<number>(params, 0);
      const since = expectParam<number>(params, 1);
      const limit = expectParam<number>(params, 2);
      const rows = workspaceEvents
        .filter((item) => item.workspace_id === workspace && item.id > since)
        .sort((a, b) => a.id - b.id)
        .slice(0, limit);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith("insert into import_export_jobs") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: ImportExportJobRow = {
        id: importExportJobId++,
        workspace_id: expectParam<number>(params, 0),
        type: expectParam<"export" | "import">(params, 1),
        status: expectParam<"completed">(params, 2),
        format: expectParam<"json">(params, 3),
        summary_json: expectParam<string>(params, 4),
        artifact_json: expectParam<string>(params, 5),
        created_by_user_id: expectParam<number>(params, 6),
        created_at: now,
        completed_at: expectParam<Date>(params, 7),
      };
      importExportJobs.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, type, status, format, summary_json, artifact_json, created_by_user_id, created_at, completed_at from import_export_jobs where workspace_id =",
      ) &&
      normalized.includes("and id =")
    ) {
      const workspaceId = expectParam<number>(params, 0);
      const jobId = expectParam<number>(params, 1);
      const row = importExportJobs.find(
        (item) => item.workspace_id === workspaceId && item.id === jobId,
      );
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, type, status, format, summary_json, artifact_json, created_by_user_id, created_at, completed_at from import_export_jobs where workspace_id =",
      )
    ) {
      const workspaceId = expectParam<number>(params, 0);
      const rows = importExportJobs
        .filter((item) => item.workspace_id === workspaceId)
        .sort((left, right) => right.id - left.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, name, email, password_hash, created_at from auth_users where email =",
      )
    ) {
      const email = expectParam<string>(params, 0);
      const row = users.find((item) => item.email === email);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, name, email, password_hash, created_at from auth_users where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = users.find((item) => item.id === id);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith("insert into auth_users") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: AuthUserRow = {
        id: userId++,
        name: expectParam<string>(params, 0),
        email: expectParam<string>(params, 1),
        password_hash: expectParam<string>(params, 2),
        created_at: now,
      };
      users.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (normalized.startsWith("select slug from workspaces where slug =")) {
      const exact = expectParam<string>(params, 0);
      const prefix = expectParam<string>(params, 1).replace(/%$/, "");
      const rows = workspaces
        .filter((item) => item.slug === exact || item.slug.startsWith(prefix))
        .map((item) => ({ slug: item.slug }));
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith("insert into workspaces") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: WorkspaceRow = {
        id: workspaceId++,
        name: expectParam<string>(params, 0),
        slug: expectParam<string>(params, 1),
        type: expectParam<"personal" | "team">(params, 2),
        created_by_user_id: expectParam<number>(params, 3),
        created_at: now,
      };
      workspaces.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, name, slug, type, created_by_user_id, created_at from workspaces where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = workspaces.find((item) => item.id === id);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (normalized.startsWith("update workspaces set name =")) {
      const id = expectParam<number>(params, 0);
      const row = workspaces.find((item) => item.id === id);

      if (row) {
        row.name = expectParam<string>(params, 1);
        row.type = expectParam<"personal" | "team">(params, 2);
      }

      return { rows: [] as TRow[], rowCount: row ? 1 : 0 };
    }

    if (
      normalized.startsWith("insert into workspace_invitations") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: WorkspaceInvitationRow = {
        id: workspaceInvitationId++,
        workspace_id: expectParam<number>(params, 0),
        invited_by_user_id: expectParam<number>(params, 1),
        email: expectParam<string>(params, 2),
        role: expectParam<"owner" | "admin" | "member">(params, 3),
        token_hash: expectParam<string>(params, 4),
        expires_at: expectParam<Date>(params, 5),
        accepted_at: null,
        created_at: now,
      };
      workspaceInvitations.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, invited_by_user_id, email, role, token_hash, expires_at, accepted_at, created_at from workspace_invitations where token_hash =",
      )
    ) {
      const tokenHash = expectParam<string>(params, 0);
      const row = workspaceInvitations.find(
        (item) => item.token_hash === tokenHash,
      );
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, invited_by_user_id, email, role, token_hash, expires_at, accepted_at, created_at from workspace_invitations where workspace_id =",
      )
    ) {
      const workspace = expectParam<number>(params, 0);
      const email = expectParam<string>(params, 1);
      const row = workspaceInvitations
        .filter(
          (item) =>
            item.workspace_id === workspace &&
            item.email === email &&
            item.accepted_at === null,
        )
        .sort((a, b) => b.id - a.id)[0];
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "update workspace_invitations set accepted_at = current_timestamp",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = workspaceInvitations.find((item) => item.id === id);

      if (row && row.accepted_at === null) {
        row.accepted_at = new Date();
        return { rows: [] as TRow[], rowCount: 1 };
      }

      return { rows: [] as TRow[], rowCount: 0 };
    }

    if (
      normalized.startsWith("insert into workspace_memberships") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: MembershipRow = {
        id: membershipId++,
        user_id: expectParam<number>(params, 0),
        workspace_id: expectParam<number>(params, 1),
        role: expectParam<"owner" | "admin" | "member">(params, 2),
        created_at: now,
      };
      memberships.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, user_id, workspace_id, role, created_at from workspace_memberships where user_id =",
      )
    ) {
      const user = expectParam<number>(params, 0);

      if (normalized.includes("and workspace_id =")) {
        const workspace = expectParam<number>(params, 1);
        const row = memberships.find(
          (item) => item.user_id === user && item.workspace_id === workspace,
        );
        const rows = row ? castRows<TRow>([row]) : [];
        return { rows, rowCount: rows.length };
      }

      const rows = memberships
        .filter((item) => item.user_id === user)
        .sort((a, b) => a.id - b.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, user_id, workspace_id, role, created_at from workspace_memberships where workspace_id =",
      )
    ) {
      const workspace = expectParam<number>(params, 0);
      const rows = memberships
        .filter((item) => item.workspace_id === workspace)
        .sort((a, b) => a.id - b.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select u.id as user_id, u.name, u.email, m.role from workspace_memberships m join auth_users u on u.id = m.user_id where m.workspace_id =",
      )
    ) {
      const workspace = expectParam<number>(params, 0);
      const rows = memberships
        .filter((item) => item.workspace_id === workspace)
        .sort((a, b) => a.id - b.id)
        .flatMap((membership) => {
          const user = users.find((item) => item.id === membership.user_id);

          if (!user) {
            return [];
          }

          return [
            {
              user_id: user.id,
              name: user.name,
              email: user.email,
              role: membership.role,
            },
          ];
        });
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select u.id as user_id, u.name as user_name, u.email as user_email, u.password_hash as user_password_hash, u.created_at as user_created_at, w.id as workspace_id, w.name as workspace_name, w.slug as workspace_slug, w.type as workspace_type, w.created_by_user_id as workspace_created_by_user_id, w.created_at as workspace_created_at, m.role as membership_role from auth_users u join workspace_memberships m on m.user_id = u.id join workspaces w on w.id = m.workspace_id where u.id =",
      )
    ) {
      const userIdParam = expectParam<number>(params, 0);
      const workspaceIdParam = expectParam<number>(params, 1);
      const user = users.find((item) => item.id === userIdParam);
      const membership = memberships.find(
        (item) =>
          item.user_id === userIdParam &&
          item.workspace_id === workspaceIdParam,
      );
      const workspace = membership
        ? workspaces.find((item) => item.id === membership.workspace_id)
        : undefined;

      if (!user || !membership || !workspace) {
        return { rows: [] as TRow[], rowCount: 0 };
      }

      const row = {
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        user_password_hash: user.password_hash,
        user_created_at: user.created_at,
        workspace_id: workspace.id,
        workspace_name: workspace.name,
        workspace_slug: workspace.slug,
        workspace_type: workspace.type,
        workspace_created_by_user_id: workspace.created_by_user_id,
        workspace_created_at: workspace.created_at,
        membership_role: membership.role,
      };
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select m.role, w.id as workspace_id, w.name as workspace_name, w.slug as workspace_slug, w.type as workspace_type, w.created_by_user_id as workspace_created_by_user_id, w.created_at as workspace_created_at from workspace_memberships m join workspaces w on w.id = m.workspace_id where m.user_id =",
      )
    ) {
      const user = expectParam<number>(params, 0);
      const rows = memberships
        .filter((item) => item.user_id === user)
        .sort((a, b) => a.id - b.id)
        .flatMap((membership) => {
          const workspace = workspaces.find(
            (item) => item.id === membership.workspace_id,
          );

          if (!workspace) {
            return [];
          }

          return [
            {
              role: membership.role,
              workspace_id: workspace.id,
              workspace_name: workspace.name,
              workspace_slug: workspace.slug,
              workspace_type: workspace.type,
              workspace_created_by_user_id: workspace.created_by_user_id,
              workspace_created_at: workspace.created_at,
            },
          ];
        });
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (normalized.startsWith("update workspace_memberships set role =")) {
      const membership = memberships.find(
        (item) =>
          item.user_id === expectParam<number>(params, 0) &&
          item.workspace_id === expectParam<number>(params, 1),
      );

      if (membership) {
        membership.role = expectParam<"owner" | "admin" | "member">(params, 2);
      }

      return { rows: [] as TRow[], rowCount: membership ? 1 : 0 };
    }

    if (
      normalized.startsWith("delete from workspace_memberships where user_id =")
    ) {
      const user = expectParam<number>(params, 0);
      const workspace = expectParam<number>(params, 1);
      const before = memberships.length;
      memberships = memberships.filter(
        (item) => !(item.user_id === user && item.workspace_id === workspace),
      );
      const deleted = before - memberships.length;
      return { rows: [] as TRow[], rowCount: deleted };
    }

    if (
      normalized.startsWith(
        "select count(*) as count from workspace_memberships where workspace_id =",
      )
    ) {
      const workspace = expectParam<number>(params, 0);
      const role = expectParam<"owner" | "admin" | "member">(params, 1);
      const count = memberships.filter(
        (item) => item.workspace_id === workspace && item.role === role,
      ).length;
      return {
        rows: castRows<TRow>([{ count }]),
        rowCount: 1,
      };
    }

    if (
      normalized.startsWith("insert into collections") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: CollectionRow = {
        id: collectionId++,
        workspace_id: expectParam<number>(params, 0),
        name: expectParam<string>(params, 1),
        description: expectParam<string | null>(params, 2),
        created_by_user_id: expectParam<number>(params, 3),
        created_at: now,
        updated_at: now,
      };
      collections.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, name, description, created_by_user_id, created_at, updated_at from collections where workspace_id =",
      )
    ) {
      const workspace = expectParam<number>(params, 0);
      const rows = collections
        .filter((item) => item.workspace_id === workspace)
        .sort((a, b) => a.id - b.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, name, description, created_by_user_id, created_at, updated_at from collections where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = collections.find((item) => item.id === id);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (normalized.startsWith("update collections set name =")) {
      const row = collections.find(
        (item) => item.id === expectParam<number>(params, 0),
      );

      if (row) {
        row.name = expectParam<string>(params, 1);
        row.description = expectParam<string | null>(params, 2);
        row.updated_at = new Date();
      }

      return { rows: [] as TRow[], rowCount: row ? 1 : 0 };
    }

    if (normalized.startsWith("delete from collections where id =")) {
      const id = expectParam<number>(params, 0);
      const before = collections.length;
      collections = collections.filter((item) => item.id !== id);
      collectionEndpoints = collectionEndpoints.filter(
        (item) => item.collection_id !== id,
      );
      return { rows: [] as TRow[], rowCount: before - collections.length };
    }

    if (normalized.startsWith("delete from collections")) {
      const before = collections.length;
      collections = [];
      collectionEndpoints = [];
      collectionFolders = [];
      collectionEndpointExamples = [];
      return { rows: [] as TRow[], rowCount: before };
    }

    if (
      normalized.startsWith("insert into collection_endpoints") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: CollectionEndpointRow = {
        id: collectionEndpointId++,
        collection_id: expectParam<number>(params, 0),
        folder_id: expectParam<number | null>(params, 1),
        name: expectParam<string>(params, 2),
        method: expectParam<CollectionEndpointRow["method"]>(params, 3),
        url: expectParam<string>(params, 4),
        headers_json: expectParam<string>(params, 5),
        query_params_json: expectParam<string>(params, 6),
        body_json: expectParam<string | null>(params, 7),
        auth_json: expectParam<string | null>(params, 8),
        position: expectParam<number>(params, 9),
        created_by_user_id: expectParam<number>(params, 10),
        created_at: now,
        updated_at: now,
      };
      collectionEndpoints.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, collection_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at from collection_endpoints where collection_id =",
      )
    ) {
      const collection = expectParam<number>(params, 0);
      const rows = collectionEndpoints
        .filter((item) => item.collection_id === collection)
        .sort((a, b) => a.position - b.position || a.id - b.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at from collection_endpoints where collection_id =",
      )
    ) {
      const collection = expectParam<number>(params, 0);
      const rows = collectionEndpoints
        .filter((item) => item.collection_id === collection)
        .sort((a, b) => a.position - b.position || a.id - b.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, collection_id, folder_id, name, method, url, headers_json, query_params_json, body_json, auth_json, position, created_by_user_id, created_at, updated_at from collection_endpoints where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = collectionEndpoints.find((item) => item.id === id);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (normalized.startsWith("update collection_endpoints set folder_id =")) {
      const row = collectionEndpoints.find(
        (item) => item.id === expectParam<number>(params, 0),
      );

      if (row) {
        row.folder_id = expectParam<number | null>(params, 1);
        row.name = expectParam<string>(params, 2);
        row.method = expectParam<CollectionEndpointRow["method"]>(params, 3);
        row.url = expectParam<string>(params, 4);
        row.headers_json = expectParam<string>(params, 5);
        row.query_params_json = expectParam<string>(params, 6);
        row.body_json = expectParam<string | null>(params, 7);
        row.auth_json = expectParam<string | null>(params, 8);
        row.position = expectParam<number>(params, 9);
        row.updated_at = new Date();
      }

      return { rows: [] as TRow[], rowCount: row ? 1 : 0 };
    }

    if (normalized.startsWith("delete from collection_endpoints where id =")) {
      const id = expectParam<number>(params, 0);
      const before = collectionEndpoints.length;
      collectionEndpoints = collectionEndpoints.filter(
        (item) => item.id !== id,
      );
      return {
        rows: [] as TRow[],
        rowCount: before - collectionEndpoints.length,
      };
    }

    if (normalized.startsWith("delete from collection_endpoints")) {
      const before = collectionEndpoints.length;
      collectionEndpoints = [];
      return {
        rows: [] as TRow[],
        rowCount: before,
      };
    }

    if (normalized.startsWith("delete from collection_folders where id =")) {
      const id = expectParam<number>(params, 0);
      const before = collectionFolders.length;
      collectionFolders = collectionFolders.filter((item) => item.id !== id);
      return {
        rows: [] as TRow[],
        rowCount: before - collectionFolders.length,
      };
    }

    if (normalized.startsWith("delete from collection_folders")) {
      const before = collectionFolders.length;
      collectionFolders = [];
      return {
        rows: [] as TRow[],
        rowCount: before,
      };
    }

    if (
      normalized.startsWith(
        "delete from collection_endpoint_examples where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const before = collectionEndpointExamples.length;
      collectionEndpointExamples = collectionEndpointExamples.filter(
        (item) => item.id !== id,
      );
      return {
        rows: [] as TRow[],
        rowCount: before - collectionEndpointExamples.length,
      };
    }

    if (normalized.startsWith("delete from collection_endpoint_examples")) {
      const before = collectionEndpointExamples.length;
      collectionEndpointExamples = [];
      return {
        rows: [] as TRow[],
        rowCount: before,
      };
    }

    if (
      normalized.startsWith("insert into collection_folders") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: CollectionFolderRow = {
        id: collectionFolderId++,
        collection_id: expectParam<number>(params, 0),
        parent_folder_id: expectParam<number | null>(params, 1),
        name: expectParam<string>(params, 2),
        position: expectParam<number>(params, 3),
        created_by_user_id: expectParam<number>(params, 4),
        created_at: now,
        updated_at: now,
      };
      collectionFolders.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, collection_id, parent_folder_id, name, position, created_by_user_id, created_at, updated_at from collection_folders where collection_id =",
      )
    ) {
      const collection = expectParam<number>(params, 0);
      const rows = collectionFolders
        .filter((item) => item.collection_id === collection)
        .sort((a, b) => a.position - b.position || a.id - b.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, collection_id, parent_folder_id, name, position, created_by_user_id, created_at, updated_at from collection_folders where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = collectionFolders.find((item) => item.id === id);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith("update collection_folders set parent_folder_id =")
    ) {
      const row = collectionFolders.find(
        (item) => item.id === expectParam<number>(params, 0),
      );

      if (row) {
        row.parent_folder_id = expectParam<number | null>(params, 1);
        row.name = expectParam<string>(params, 2);
        row.position = expectParam<number>(params, 3);
        row.updated_at = new Date();
      }

      return { rows: [] as TRow[], rowCount: row ? 1 : 0 };
    }

    if (normalized.startsWith("delete from collection_folders where id =")) {
      const id = expectParam<number>(params, 0);
      const before = collectionFolders.length;
      collectionFolders = collectionFolders.filter((item) => item.id !== id);
      return {
        rows: [] as TRow[],
        rowCount: before - collectionFolders.length,
      };
    }

    if (
      normalized.startsWith("insert into collection_endpoint_examples") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: CollectionEndpointExampleRow = {
        id: collectionEndpointExampleId++,
        endpoint_id: expectParam<number>(params, 0),
        name: expectParam<string>(params, 1),
        status_code: expectParam<number>(params, 2),
        headers_json: expectParam<string>(params, 3),
        body_text: expectParam<string | null>(params, 4),
        position: expectParam<number>(params, 5),
        created_by_user_id: expectParam<number>(params, 6),
        created_at: now,
        updated_at: now,
      };
      collectionEndpointExamples.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, endpoint_id, name, status_code, headers_json, body_text, position, created_by_user_id, created_at, updated_at from collection_endpoint_examples where endpoint_id =",
      )
    ) {
      const endpoint = expectParam<number>(params, 0);
      const rows = collectionEndpointExamples
        .filter((item) => item.endpoint_id === endpoint)
        .sort((a, b) => a.position - b.position || a.id - b.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, endpoint_id, name, status_code, headers_json, body_text, position, created_by_user_id, created_at, updated_at from collection_endpoint_examples where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = collectionEndpointExamples.find((item) => item.id === id);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith("update collection_endpoint_examples set name =")
    ) {
      const row = collectionEndpointExamples.find(
        (item) => item.id === expectParam<number>(params, 0),
      );

      if (row) {
        row.name = expectParam<string>(params, 1);
        row.status_code = expectParam<number>(params, 2);
        row.headers_json = expectParam<string>(params, 3);
        row.body_text = expectParam<string | null>(params, 4);
        row.position = expectParam<number>(params, 5);
        row.updated_at = new Date();
      }

      return { rows: [] as TRow[], rowCount: row ? 1 : 0 };
    }

    if (
      normalized.startsWith(
        "delete from collection_endpoint_examples where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const before = collectionEndpointExamples.length;
      collectionEndpointExamples = collectionEndpointExamples.filter(
        (item) => item.id !== id,
      );
      return {
        rows: [] as TRow[],
        rowCount: before - collectionEndpointExamples.length,
      };
    }

    if (
      normalized.startsWith("insert into environments") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: EnvironmentRow = {
        id: environmentId++,
        workspace_id: expectParam<number>(params, 0),
        name: expectParam<string>(params, 1),
        created_by_user_id: expectParam<number>(params, 2),
        created_at: now,
        updated_at: now,
      };
      environments.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, name, created_by_user_id, created_at, updated_at from environments where workspace_id =",
      ) &&
      normalized.includes("and name =")
    ) {
      const workspace = expectParam<number>(params, 0);
      const name = expectParam<string>(params, 1);
      const row = environments.find(
        (item) => item.workspace_id === workspace && item.name === name,
      );
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, name, created_by_user_id, created_at, updated_at from environments where workspace_id =",
      )
    ) {
      const workspace = expectParam<number>(params, 0);
      const rows = environments
        .filter((item) => item.workspace_id === workspace)
        .sort((a, b) => a.id - b.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, workspace_id, name, created_by_user_id, created_at, updated_at from environments where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = environments.find((item) => item.id === id);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (normalized.startsWith("update environments set name =")) {
      const row = environments.find(
        (item) => item.id === expectParam<number>(params, 0),
      );

      if (row) {
        row.name = expectParam<string>(params, 1);
        row.updated_at = new Date();
      }

      return { rows: [] as TRow[], rowCount: row ? 1 : 0 };
    }

    if (normalized.startsWith("delete from environments where id =")) {
      const id = expectParam<number>(params, 0);
      const before = environments.length;
      environments = environments.filter((item) => item.id !== id);
      environmentVariables = environmentVariables.filter(
        (item) => item.environment_id !== id,
      );
      return { rows: [] as TRow[], rowCount: before - environments.length };
    }

    if (
      normalized.startsWith("insert into environment_variables") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: EnvironmentVariableRow = {
        id: environmentVariableId++,
        environment_id: expectParam<number>(params, 0),
        key_name: expectParam<string>(params, 1),
        value_text: expectParam<string>(params, 2),
        enabled: expectParam<boolean>(params, 3),
        is_secret: expectParam<boolean>(params, 4),
        position: expectParam<number>(params, 5),
        created_by_user_id: expectParam<number>(params, 6),
        created_at: now,
        updated_at: now,
      };
      environmentVariables.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id, created_at, updated_at from environment_variables where environment_id =",
      ) &&
      normalized.includes("and key_name =")
    ) {
      const environment = expectParam<number>(params, 0);
      const keyName = expectParam<string>(params, 1);
      const row = environmentVariables.find(
        (item) =>
          item.environment_id === environment && item.key_name === keyName,
      );
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id, created_at, updated_at from environment_variables where environment_id =",
      )
    ) {
      const environment = expectParam<number>(params, 0);
      const rows = environmentVariables
        .filter((item) => item.environment_id === environment)
        .sort((a, b) => a.position - b.position || a.id - b.id);
      return { rows: castRows<TRow>(rows), rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id, environment_id, key_name, value_text, enabled, is_secret, position, created_by_user_id, created_at, updated_at from environment_variables where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = environmentVariables.find((item) => item.id === id);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (normalized.startsWith("update environment_variables set key_name =")) {
      const row = environmentVariables.find(
        (item) => item.id === expectParam<number>(params, 0),
      );

      if (row) {
        row.key_name = expectParam<string>(params, 1);
        row.value_text = expectParam<string>(params, 2);
        row.enabled = expectParam<boolean>(params, 3);
        row.is_secret = expectParam<boolean>(params, 4);
        row.position = expectParam<number>(params, 5);
        row.updated_at = new Date();
      }

      return { rows: [] as TRow[], rowCount: row ? 1 : 0 };
    }

    if (normalized.startsWith("delete from environment_variables where id =")) {
      const id = expectParam<number>(params, 0);
      const before = environmentVariables.length;
      environmentVariables = environmentVariables.filter(
        (item) => item.id !== id,
      );
      return {
        rows: [] as TRow[],
        rowCount: before - environmentVariables.length,
      };
    }

    if (
      normalized.startsWith("insert into auth_sessions") &&
      normalized.includes("returning")
    ) {
      const now = new Date();
      const row: SessionRow = {
        id: sessionId++,
        user_id: expectParam<number>(params, 0),
        workspace_id: expectParam<number>(params, 1),
        refresh_token_hash: expectParam<string>(params, 2),
        expires_at: expectParam<Date>(params, 3),
        revoked_at: null,
        created_at: now,
      };
      sessions.push(row);
      return { rows: castRows<TRow>([row]), rowCount: 1 };
    }

    if (
      normalized.startsWith(
        "select id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, created_at from auth_sessions where id =",
      )
    ) {
      const id = expectParam<number>(params, 0);
      const row = sessions.find((item) => item.id === id);
      const rows = row ? castRows<TRow>([row]) : [];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith("update auth_sessions set refresh_token_hash =")
    ) {
      const session = sessions.find(
        (item) => item.id === expectParam<number>(params, 0),
      );

      if (session) {
        session.refresh_token_hash = expectParam<string>(params, 1);
      }

      return { rows: [] as TRow[], rowCount: session ? 1 : 0 };
    }

    if (
      normalized.startsWith(
        "update auth_sessions set revoked_at = current_timestamp",
      )
    ) {
      const session = sessions.find(
        (item) => item.id === expectParam<number>(params, 0),
      );

      if (session && session.revoked_at === null) {
        session.revoked_at = new Date();
        return { rows: [] as TRow[], rowCount: 1 };
      }

      return { rows: [] as TRow[], rowCount: 0 };
    }

    throw new Error(`Unexpected query in auth test DB: ${sql}`);
  };

  const db: DatabaseClient = {
    query,
    transaction: async <T>(callback: (tx: DatabaseClient) => Promise<T>) => {
      return callback(db);
    },
    close: async () => Promise.resolve(),
  };

  return db;
};
