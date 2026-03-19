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

  const query = async <TRow extends QueryRow = QueryRow>(
    sql: string,
    params: QueryParams = [],
  ): Promise<QueryResult<TRow>> => {
    const normalized = normalizeSql(sql);

    if (
      normalized.startsWith(
        "truncate table auth_sessions, workspace_memberships, workspaces, auth_users",
      )
    ) {
      users = [];
      workspaces = [];
      memberships = [];
      sessions = [];
      userId = 1;
      workspaceId = 1;
      membershipId = 1;
      sessionId = 1;
      return { rows: [] as TRow[], rowCount: 0 };
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
    dialect: "postgres",
    query,
    transaction: async <T>(callback: (tx: DatabaseClient) => Promise<T>) => {
      return callback(db);
    },
    close: async () => Promise.resolve(),
  };

  return db;
};
