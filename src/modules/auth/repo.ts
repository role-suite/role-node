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

export type WorkspaceMemberWithUser = {
  userId: number;
  name: string;
  email: string;
  role: MembershipRole;
};

export type MembershipWithWorkspace = {
  role: MembershipRole;
  workspace: Workspace;
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

export type WorkspaceEvent = {
  id: number;
  workspaceId: number;
  actorUserId: number;
  entity: string;
  action: string;
  entityId: number | null;
  payloadJson: string | null;
  createdAt: Date;
};

export type WorkspaceInvitation = {
  id: number;
  workspaceId: number;
  invitedByUserId: number;
  email: string;
  role: MembershipRole;
  tokenHash: string;
  expiresAt: Date;
  acceptedAt: Date | null;
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

type WorkspaceMemberWithUserRow = {
  user_id: number;
  name: string;
  email: string;
  role: MembershipRole;
};

type MembershipWithWorkspaceRow = {
  role: MembershipRole;
  workspace_id: number;
  workspace_name: string;
  workspace_slug: string;
  workspace_type: "personal" | "team";
  workspace_created_by_user_id: number;
  workspace_created_at: Date | string;
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

type WorkspaceEventRow = {
  id: number;
  workspace_id: number;
  actor_user_id: number;
  entity: string;
  action: string;
  entity_id: number | null;
  payload_json: unknown | null;
  created_at: Date | string;
};

type WorkspaceInvitationRow = {
  id: number;
  workspace_id: number;
  invited_by_user_id: number;
  email: string;
  role: MembershipRole;
  token_hash: string;
  expires_at: Date | string;
  accepted_at: Date | string | null;
  created_at: Date | string;
};

const USERS_TABLE = "auth_users";
const WORKSPACES_TABLE = "workspaces";
const MEMBERSHIPS_TABLE = "workspace_memberships";
const SESSIONS_TABLE = "auth_sessions";
const WORKSPACE_EVENTS_TABLE = "workspace_events";
const INVITATIONS_TABLE = "workspace_invitations";

let dbOverride: DatabaseClient | null = null;

const resolveDb = (): DatabaseClient => {
  return dbOverride ?? getDb();
};

export const setAuthRepoDbClient = (dbClient: DatabaseClient | null): void => {
  dbOverride = dbClient;
};

const resolveToken = (index: number): string => {
  return `$${index}`;
};

const toDate = (value: Date | string): Date => {
  return value instanceof Date ? value : new Date(value);
};

const stringifyNullableJsonColumn = (value: unknown | null): string | null => {
  if (value === null) {
    return null;
  }

  return typeof value === "string" ? value : JSON.stringify(value);
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

const mapWorkspaceMemberWithUserRow = (
  row: WorkspaceMemberWithUserRow,
): WorkspaceMemberWithUser => {
  return {
    userId: row.user_id,
    name: row.name,
    email: row.email,
    role: row.role,
  };
};

const mapMembershipWithWorkspaceRow = (
  row: MembershipWithWorkspaceRow,
): MembershipWithWorkspace => {
  return {
    role: row.role,
    workspace: {
      id: row.workspace_id,
      name: row.workspace_name,
      slug: row.workspace_slug,
      type: row.workspace_type,
      createdByUserId: row.workspace_created_by_user_id,
      createdAt: toDate(row.workspace_created_at),
    },
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

const mapWorkspaceEventRow = (row: WorkspaceEventRow): WorkspaceEvent => {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    actorUserId: row.actor_user_id,
    entity: row.entity,
    action: row.action,
    entityId: row.entity_id,
    payloadJson: stringifyNullableJsonColumn(row.payload_json),
    createdAt: toDate(row.created_at),
  };
};

const mapWorkspaceInvitationRow = (
  row: WorkspaceInvitationRow,
): WorkspaceInvitation => {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    invitedByUserId: row.invited_by_user_id,
    email: row.email,
    role: row.role,
    tokenHash: row.token_hash,
    expiresAt: toDate(row.expires_at),
    acceptedAt: row.accepted_at ? toDate(row.accepted_at) : null,
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

    const result = await db.query<UserRow>(
      `INSERT INTO ${USERS_TABLE} (name, email, password_hash) VALUES (${nameToken}, ${emailToken}, ${hashToken}) RETURNING id, name, email, password_hash, created_at`,
      [payload.name, payload.email, payload.passwordHash],
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

    const result = await db.query<WorkspaceRow>(
      `INSERT INTO ${WORKSPACES_TABLE} (name, slug, type, created_by_user_id) VALUES (${nameToken}, ${slugToken}, ${typeToken}, ${createdByToken}) RETURNING id, name, slug, type, created_by_user_id, created_at`,
      [payload.name, slug, payload.type, payload.createdByUserId],
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

    const result = await db.query<MembershipRow>(
      `INSERT INTO ${MEMBERSHIPS_TABLE} (user_id, workspace_id, role) VALUES (${userToken}, ${workspaceToken}, ${roleToken}) RETURNING id, user_id, workspace_id, role, created_at`,
      [payload.userId, payload.workspaceId, payload.role],
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

  async listMembershipsByWorkspace(workspaceId: number): Promise<Membership[]> {
    const workspaceToken = resolveToken(1);
    const result = await resolveDb().query<MembershipRow>(
      `SELECT id, user_id, workspace_id, role, created_at FROM ${MEMBERSHIPS_TABLE} WHERE workspace_id = ${workspaceToken} ORDER BY id ASC`,
      [workspaceId],
    );

    return result.rows.map(mapMembershipRow);
  },

  async listWorkspaceMembersWithUser(
    workspaceId: number,
  ): Promise<WorkspaceMemberWithUser[]> {
    const workspaceToken = resolveToken(1);
    const result = await resolveDb().query<WorkspaceMemberWithUserRow>(
      `SELECT u.id AS user_id, u.name, u.email, m.role
       FROM ${MEMBERSHIPS_TABLE} m
       JOIN ${USERS_TABLE} u ON u.id = m.user_id
       WHERE m.workspace_id = ${workspaceToken}
       ORDER BY m.id ASC`,
      [workspaceId],
    );

    return result.rows.map(mapWorkspaceMemberWithUserRow);
  },

  async listMembershipsWithWorkspaceByUser(
    userId: number,
  ): Promise<MembershipWithWorkspace[]> {
    const userToken = resolveToken(1);
    const result = await resolveDb().query<MembershipWithWorkspaceRow>(
      `SELECT m.role,
              w.id AS workspace_id,
              w.name AS workspace_name,
              w.slug AS workspace_slug,
              w.type AS workspace_type,
              w.created_by_user_id AS workspace_created_by_user_id,
              w.created_at AS workspace_created_at
       FROM ${MEMBERSHIPS_TABLE} m
       JOIN ${WORKSPACES_TABLE} w ON w.id = m.workspace_id
       WHERE m.user_id = ${userToken}
       ORDER BY m.id ASC`,
      [userId],
    );

    return result.rows.map(mapMembershipWithWorkspaceRow);
  },

  async updateMembershipRole(
    userId: number,
    workspaceId: number,
    role: MembershipRole,
  ): Promise<void> {
    const userToken = resolveToken(1);
    const workspaceToken = resolveToken(2);
    const roleToken = resolveToken(3);
    await resolveDb().query(
      `UPDATE ${MEMBERSHIPS_TABLE} SET role = ${roleToken} WHERE user_id = ${userToken} AND workspace_id = ${workspaceToken}`,
      [userId, workspaceId, role],
    );
  },

  async deleteMembershipByUserAndWorkspace(
    userId: number,
    workspaceId: number,
  ): Promise<void> {
    const userToken = resolveToken(1);
    const workspaceToken = resolveToken(2);
    await resolveDb().query(
      `DELETE FROM ${MEMBERSHIPS_TABLE} WHERE user_id = ${userToken} AND workspace_id = ${workspaceToken}`,
      [userId, workspaceId],
    );
  },

  async countMembershipsByRole(
    workspaceId: number,
    role: MembershipRole,
  ): Promise<number> {
    const workspaceToken = resolveToken(1);
    const roleToken = resolveToken(2);
    const result = await resolveDb().query<{ count: number | string }>(
      `SELECT COUNT(*) as count FROM ${MEMBERSHIPS_TABLE} WHERE workspace_id = ${workspaceToken} AND role = ${roleToken}`,
      [workspaceId, role],
    );

    const value = result.rows[0]?.count;

    if (value === undefined) {
      return 0;
    }

    return typeof value === "number" ? value : Number(value);
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
    const db = resolveDb();
    await db.query(
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

  async createWorkspaceEvent(payload: {
    workspaceId: number;
    actorUserId: number;
    entity: string;
    action: string;
    entityId: number | null;
    payloadJson: string | null;
  }): Promise<WorkspaceEvent> {
    const workspaceToken = resolveToken(1);
    const actorToken = resolveToken(2);
    const entityToken = resolveToken(3);
    const actionToken = resolveToken(4);
    const entityIdToken = resolveToken(5);
    const payloadToken = resolveToken(6);
    const db = resolveDb();

    const result = await db.query<WorkspaceEventRow>(
      `INSERT INTO ${WORKSPACE_EVENTS_TABLE} (workspace_id, actor_user_id, entity, action, entity_id, payload_json) VALUES (${workspaceToken}, ${actorToken}, ${entityToken}, ${actionToken}, ${entityIdToken}, ${payloadToken}) RETURNING id, workspace_id, actor_user_id, entity, action, entity_id, payload_json, created_at`,
      [
        payload.workspaceId,
        payload.actorUserId,
        payload.entity,
        payload.action,
        payload.entityId,
        payload.payloadJson,
      ],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create workspace event");
    }

    return mapWorkspaceEventRow(row);
  },

  async listWorkspaceEventsByCursor(
    workspaceId: number,
    sinceEventId: number,
    limit: number,
  ): Promise<WorkspaceEvent[]> {
    const workspaceToken = resolveToken(1);
    const sinceToken = resolveToken(2);
    const limitToken = resolveToken(3);
    const result = await resolveDb().query<WorkspaceEventRow>(
      `SELECT id, workspace_id, actor_user_id, entity, action, entity_id, payload_json, created_at FROM ${WORKSPACE_EVENTS_TABLE} WHERE workspace_id = ${workspaceToken} AND id > ${sinceToken} ORDER BY id ASC LIMIT ${limitToken}`,
      [workspaceId, sinceEventId, limit],
    );

    return result.rows.map(mapWorkspaceEventRow);
  },

  async createWorkspaceInvitation(payload: {
    workspaceId: number;
    invitedByUserId: number;
    email: string;
    role: MembershipRole;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<WorkspaceInvitation> {
    const workspaceToken = resolveToken(1);
    const invitedByToken = resolveToken(2);
    const emailToken = resolveToken(3);
    const roleToken = resolveToken(4);
    const tokenHashToken = resolveToken(5);
    const expiresToken = resolveToken(6);
    const db = resolveDb();

    const result = await db.query<WorkspaceInvitationRow>(
      `INSERT INTO ${INVITATIONS_TABLE} (workspace_id, invited_by_user_id, email, role, token_hash, expires_at) VALUES (${workspaceToken}, ${invitedByToken}, ${emailToken}, ${roleToken}, ${tokenHashToken}, ${expiresToken}) RETURNING id, workspace_id, invited_by_user_id, email, role, token_hash, expires_at, accepted_at, created_at`,
      [
        payload.workspaceId,
        payload.invitedByUserId,
        payload.email,
        payload.role,
        payload.tokenHash,
        payload.expiresAt,
      ],
    );
    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create workspace invitation");
    }

    return mapWorkspaceInvitationRow(row);
  },

  async findWorkspaceInvitationByTokenHash(
    tokenHash: string,
  ): Promise<WorkspaceInvitation | undefined> {
    const token = resolveToken(1);
    const result = await resolveDb().query<WorkspaceInvitationRow>(
      `SELECT id, workspace_id, invited_by_user_id, email, role, token_hash, expires_at, accepted_at, created_at FROM ${INVITATIONS_TABLE} WHERE token_hash = ${token}`,
      [tokenHash],
    );

    const row = result.rows[0];
    return row ? mapWorkspaceInvitationRow(row) : undefined;
  },

  async findPendingWorkspaceInvitationByEmail(
    workspaceId: number,
    email: string,
  ): Promise<WorkspaceInvitation | undefined> {
    const workspaceToken = resolveToken(1);
    const emailToken = resolveToken(2);
    const result = await resolveDb().query<WorkspaceInvitationRow>(
      `SELECT id, workspace_id, invited_by_user_id, email, role, token_hash, expires_at, accepted_at, created_at FROM ${INVITATIONS_TABLE} WHERE workspace_id = ${workspaceToken} AND email = ${emailToken} AND accepted_at IS NULL ORDER BY id DESC LIMIT 1`,
      [workspaceId, email],
    );

    const row = result.rows[0];
    return row ? mapWorkspaceInvitationRow(row) : undefined;
  },

  async markWorkspaceInvitationAccepted(invitationId: number): Promise<void> {
    const token = resolveToken(1);
    await resolveDb().query(
      `UPDATE ${INVITATIONS_TABLE} SET accepted_at = CURRENT_TIMESTAMP WHERE id = ${token} AND accepted_at IS NULL`,
      [invitationId],
    );
  },

  async updateWorkspaceTypeAndName(payload: {
    workspaceId: number;
    name: string;
    type: "personal" | "team";
  }): Promise<void> {
    const idToken = resolveToken(1);
    const nameToken = resolveToken(2);
    const typeToken = resolveToken(3);
    await resolveDb().query(
      `UPDATE ${WORKSPACES_TABLE} SET name = ${nameToken}, type = ${typeToken} WHERE id = ${idToken}`,
      [payload.workspaceId, payload.name, payload.type],
    );
  },

  async clear(): Promise<void> {
    const db = resolveDb();

    await db.query(
      `TRUNCATE TABLE ${WORKSPACE_EVENTS_TABLE}, ${INVITATIONS_TABLE}, ${SESSIONS_TABLE}, ${MEMBERSHIPS_TABLE}, ${WORKSPACES_TABLE}, ${USERS_TABLE} RESTART IDENTITY CASCADE`,
    );
  },
};
