import { getDb } from "../../config/db.js";
import type { DatabaseClient } from "../../types/db.js";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export type Workspace = {
  id: number;
  name: string;
  slug: string;
  type: "personal" | "team";
  createdByUserId: number;
  createdAt: Date;
};

export type MembershipRole = "owner" | "admin" | "member";

export type Membership = {
  id: number;
  userId: number;
  workspaceId: number;
  role: MembershipRole;
  createdAt: Date;
};

export type Session = {
  id: number;
  userId: number;
  workspaceId: number;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date | string;
};

type WorkspaceRow = {
  id: number;
  name: string;
  slug: string;
  type: "personal" | "team";
  created_by_user_id: number;
  created_at: Date | string;
};

type MembershipRow = {
  id: number;
  user_id: number;
  workspace_id: number;
  role: MembershipRole;
  created_at: Date | string;
};

type SessionRow = {
  id: number;
  user_id: number;
  workspace_id: number;
  refresh_token_hash: string;
  expires_at: Date | string;
  revoked_at: Date | string | null;
  created_at: Date | string;
};

const USERS_TABLE = "auth_users";
const WORKSPACES_TABLE = "workspaces";
const MEMBERSHIPS_TABLE = "workspace_memberships";
const SESSIONS_TABLE = "auth_sessions";

let dbOverride: DatabaseClient | null = null;

const resolveDb = (): DatabaseClient => {
  return dbOverride ?? getDb();
};

export const setAuthRepoDbClient = (dbClient: DatabaseClient | null): void => {
  dbOverride = dbClient;
};

const resolveToken = (index: number): string => {
  return resolveDb().dialect === "postgres" ? `$${index}` : "?";
};

const toDate = (value: Date | string): Date => {
  return value instanceof Date ? value : new Date(value);
};

const mapUserRow = (row: UserRow): AuthUser => {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: toDate(row.created_at),
  };
};

const mapWorkspaceRow = (row: WorkspaceRow): Workspace => {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: row.type,
    createdByUserId: row.created_by_user_id,
    createdAt: toDate(row.created_at),
  };
};

const mapMembershipRow = (row: MembershipRow): Membership => {
  return {
    id: row.id,
    userId: row.user_id,
    workspaceId: row.workspace_id,
    role: row.role,
    createdAt: toDate(row.created_at),
  };
};

const mapSessionRow = (row: SessionRow): Session => {
  return {
    id: row.id,
    userId: row.user_id,
    workspaceId: row.workspace_id,
    refreshTokenHash: row.refresh_token_hash,
    expiresAt: toDate(row.expires_at),
    revokedAt: row.revoked_at ? toDate(row.revoked_at) : null,
    createdAt: toDate(row.created_at),
  };
};

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
};

const buildUniqueWorkspaceSlug = async (
  workspaceName: string,
): Promise<string> => {
  const base = slugify(workspaceName) || "workspace";
  const exactToken = resolveToken(1);
  const prefixToken = resolveToken(2);
  const db = resolveDb();
  const existingRows = await db.query<{ slug: string }>(
    `SELECT slug FROM ${WORKSPACES_TABLE} WHERE slug = ${exactToken} OR slug LIKE ${prefixToken}`,
    [base, `${base}-%`],
  );

  const usedSlugs = new Set(existingRows.rows.map((row) => row.slug));

  if (!usedSlugs.has(base)) {
    return base;
  }

  let suffix = 1;

  while (usedSlugs.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
};

export const authRepo = {
  async createUser(payload: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<AuthUser> {
    const nameToken = resolveToken(1);
    const emailToken = resolveToken(2);
    const hashToken = resolveToken(3);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<UserRow>(
        `INSERT INTO ${USERS_TABLE} (name, email, password_hash) VALUES (${nameToken}, ${emailToken}, ${hashToken}) RETURNING id, name, email, password_hash, created_at`,
        [payload.name, payload.email, payload.passwordHash],
      );
      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create auth user");
      }

      return mapUserRow(row);
    }

    await db.query(
      `INSERT INTO ${USERS_TABLE} (name, email, password_hash) VALUES (${nameToken}, ${emailToken}, ${hashToken})`,
      [payload.name, payload.email, payload.passwordHash],
    );

    const result = await db.query<UserRow>(
      `SELECT id, name, email, password_hash, created_at FROM ${USERS_TABLE} WHERE email = ${nameToken}`,
      [payload.email],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create auth user");
    }

    return mapUserRow(row);
  },

  async findUserById(id: number): Promise<AuthUser | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<UserRow>(
      `SELECT id, name, email, password_hash, created_at FROM ${USERS_TABLE} WHERE id = ${token}`,
      [id],
    );

    const row = result.rows[0];
    return row ? mapUserRow(row) : undefined;
  },

  async findUserByEmail(email: string): Promise<AuthUser | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<UserRow>(
      `SELECT id, name, email, password_hash, created_at FROM ${USERS_TABLE} WHERE email = ${token}`,
      [email],
    );

    const row = result.rows[0];
    return row ? mapUserRow(row) : undefined;
  },

  async createWorkspace(payload: {
    name: string;
    type: "personal" | "team";
    createdByUserId: number;
  }): Promise<Workspace> {
    const slug = await buildUniqueWorkspaceSlug(payload.name);
    const nameToken = resolveToken(1);
    const slugToken = resolveToken(2);
    const typeToken = resolveToken(3);
    const createdByToken = resolveToken(4);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<WorkspaceRow>(
        `INSERT INTO ${WORKSPACES_TABLE} (name, slug, type, created_by_user_id) VALUES (${nameToken}, ${slugToken}, ${typeToken}, ${createdByToken}) RETURNING id, name, slug, type, created_by_user_id, created_at`,
        [payload.name, slug, payload.type, payload.createdByUserId],
      );
      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create workspace");
      }

      return mapWorkspaceRow(row);
    }

    await db.query(
      `INSERT INTO ${WORKSPACES_TABLE} (name, slug, type, created_by_user_id) VALUES (${nameToken}, ${slugToken}, ${typeToken}, ${createdByToken})`,
      [payload.name, slug, payload.type, payload.createdByUserId],
    );

    const result = await db.query<WorkspaceRow>(
      `SELECT id, name, slug, type, created_by_user_id, created_at FROM ${WORKSPACES_TABLE} WHERE slug = ${nameToken}`,
      [slug],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create workspace");
    }

    return mapWorkspaceRow(row);
  },

  async findWorkspaceById(id: number): Promise<Workspace | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<WorkspaceRow>(
      `SELECT id, name, slug, type, created_by_user_id, created_at FROM ${WORKSPACES_TABLE} WHERE id = ${token}`,
      [id],
    );

    const row = result.rows[0];
    return row ? mapWorkspaceRow(row) : undefined;
  },

  async createMembership(payload: {
    userId: number;
    workspaceId: number;
    role: MembershipRole;
  }): Promise<Membership> {
    const userToken = resolveToken(1);
    const workspaceToken = resolveToken(2);
    const roleToken = resolveToken(3);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<MembershipRow>(
        `INSERT INTO ${MEMBERSHIPS_TABLE} (user_id, workspace_id, role) VALUES (${userToken}, ${workspaceToken}, ${roleToken}) RETURNING id, user_id, workspace_id, role, created_at`,
        [payload.userId, payload.workspaceId, payload.role],
      );
      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create workspace membership");
      }

      return mapMembershipRow(row);
    }

    await db.query(
      `INSERT INTO ${MEMBERSHIPS_TABLE} (user_id, workspace_id, role) VALUES (${userToken}, ${workspaceToken}, ${roleToken})`,
      [payload.userId, payload.workspaceId, payload.role],
    );

    const result = await db.query<MembershipRow>(
      `SELECT id, user_id, workspace_id, role, created_at FROM ${MEMBERSHIPS_TABLE} WHERE user_id = ${userToken} AND workspace_id = ${workspaceToken}`,
      [payload.userId, payload.workspaceId],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create workspace membership");
    }

    return mapMembershipRow(row);
  },

  async findMembershipByUserAndWorkspace(
    userId: number,
    workspaceId: number,
  ): Promise<Membership | undefined> {
    const userToken = resolveToken(1);
    const workspaceToken = resolveToken(2);
    const result = await resolveDb().query<MembershipRow>(
      `SELECT id, user_id, workspace_id, role, created_at FROM ${MEMBERSHIPS_TABLE} WHERE user_id = ${userToken} AND workspace_id = ${workspaceToken}`,
      [userId, workspaceId],
    );

    const row = result.rows[0];
    return row ? mapMembershipRow(row) : undefined;
  },

  async listMembershipsByUser(userId: number): Promise<Membership[]> {
    const userToken = resolveToken(1);
    const result = await resolveDb().query<MembershipRow>(
      `SELECT id, user_id, workspace_id, role, created_at FROM ${MEMBERSHIPS_TABLE} WHERE user_id = ${userToken} ORDER BY id ASC`,
      [userId],
    );

    return result.rows.map(mapMembershipRow);
  },

  async createSession(payload: {
    userId: number;
    workspaceId: number;
    refreshTokenHash: string;
    expiresAt: Date;
  }): Promise<Session> {
    const userToken = resolveToken(1);
    const workspaceToken = resolveToken(2);
    const hashToken = resolveToken(3);
    const expiryToken = resolveToken(4);
    const db = resolveDb();

    if (db.dialect === "postgres") {
      const result = await db.query<SessionRow>(
        `INSERT INTO ${SESSIONS_TABLE} (user_id, workspace_id, refresh_token_hash, expires_at) VALUES (${userToken}, ${workspaceToken}, ${hashToken}, ${expiryToken}) RETURNING id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, created_at`,
        [
          payload.userId,
          payload.workspaceId,
          payload.refreshTokenHash,
          payload.expiresAt,
        ],
      );
      const row = result.rows[0];

      if (!row) {
        throw new Error("Failed to create auth session");
      }

      return mapSessionRow(row);
    }

    await db.query(
      `INSERT INTO ${SESSIONS_TABLE} (user_id, workspace_id, refresh_token_hash, expires_at) VALUES (${userToken}, ${workspaceToken}, ${hashToken}, ${expiryToken})`,
      [
        payload.userId,
        payload.workspaceId,
        payload.refreshTokenHash,
        payload.expiresAt,
      ],
    );

    const result = await db.query<SessionRow>(
      `SELECT id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, created_at FROM ${SESSIONS_TABLE} WHERE user_id = ${userToken} AND workspace_id = ${workspaceToken} ORDER BY id DESC LIMIT 1`,
      [payload.userId, payload.workspaceId],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create auth session");
    }

    return mapSessionRow(row);
  },

  async findSessionById(id: number): Promise<Session | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<SessionRow>(
      `SELECT id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, created_at FROM ${SESSIONS_TABLE} WHERE id = ${token}`,
      [id],
    );

    const row = result.rows[0];
    return row ? mapSessionRow(row) : undefined;
  },

  async updateSessionRefreshTokenHash(
    sessionId: number,
    refreshTokenHash: string,
  ): Promise<void> {
    const sessionToken = resolveToken(1);
    const hashToken = resolveToken(2);
    await resolveDb().query(
      `UPDATE ${SESSIONS_TABLE} SET refresh_token_hash = ${hashToken} WHERE id = ${sessionToken}`,
      [sessionId, refreshTokenHash],
    );
  },

  async revokeSessionById(sessionId: number): Promise<void> {
    const sessionToken = resolveToken(1);
    await resolveDb().query(
      `UPDATE ${SESSIONS_TABLE} SET revoked_at = CURRENT_TIMESTAMP WHERE id = ${sessionToken} AND revoked_at IS NULL`,
      [sessionId],
    );
  },

  async clear(): Promise<void> {
    const db = resolveDb();

    if (db.dialect === "postgres") {
      await db.query(
        `TRUNCATE TABLE ${SESSIONS_TABLE}, ${MEMBERSHIPS_TABLE}, ${WORKSPACES_TABLE}, ${USERS_TABLE} RESTART IDENTITY CASCADE`,
      );
      return;
    }

    await db.query(`DELETE FROM ${SESSIONS_TABLE}`);
    await db.query(`DELETE FROM ${MEMBERSHIPS_TABLE}`);
    await db.query(`DELETE FROM ${WORKSPACES_TABLE}`);
    await db.query(`DELETE FROM ${USERS_TABLE}`);
    await db.query(`ALTER TABLE ${SESSIONS_TABLE} AUTO_INCREMENT = 1`);
    await db.query(`ALTER TABLE ${MEMBERSHIPS_TABLE} AUTO_INCREMENT = 1`);
    await db.query(`ALTER TABLE ${WORKSPACES_TABLE} AUTO_INCREMENT = 1`);
    await db.query(`ALTER TABLE ${USERS_TABLE} AUTO_INCREMENT = 1`);
  },
};
