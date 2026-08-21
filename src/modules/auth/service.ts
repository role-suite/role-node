import { env } from "../../config/env.js";
import {
  hashPassword,
  hashToken,
  verifyPassword,
} from "../../shared/auth/password.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import {
  createAuthToken,
  verifyRefreshToken,
} from "../../shared/auth/tokens.js";

import { authRepo, withAuthTransaction } from "./repo.js";
import type { AuthUser, MembershipWithWorkspace, Workspace } from "./repo.js";
import type { LoginInput, RefreshTokenInput, RegisterInput } from "./schema.js";

type AuthRole = "owner" | "admin" | "member";

type AuthResponse = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  workspace: {
    id: number;
    _id: number;
    name: string;
    slug: string;
    type: "personal" | "team";
    role: AuthRole;
  };
  memberships: Array<{
    workspaceId: number;
    _id: number;
    name: string;
    slug: string;
    type: "personal" | "team";
    role: AuthRole;
  }>;
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenTtlSeconds: number;
    refreshTokenTtlSeconds: number;
  };
};

type AuthContext = {
  userId: number;
  workspaceId: number;
  role: AuthRole;
};

const createWorkspaceNameForSingleAccount = (name: string): string => {
  const [firstName] = name.split(" ");
  return `${firstName ?? "Personal"}'s Workspace`;
};

// `_id` mirrors `id`/`workspaceId` for legacy Mongo-style API clients; new consumers should use
// the plain numeric field instead.
const toWorkspaceSummary = (
  workspace: Workspace,
  role: AuthRole,
): AuthResponse["workspace"] => ({
  id: workspace.id,
  _id: workspace.id,
  name: workspace.name,
  slug: workspace.slug,
  type: workspace.type,
  role,
});

const toMembershipSummary = (
  membership: MembershipWithWorkspace,
): AuthResponse["memberships"][number] => ({
  workspaceId: membership.workspace.id,
  _id: membership.workspace.id,
  name: membership.workspace.name,
  slug: membership.workspace.slug,
  type: membership.workspace.type,
  role: membership.role,
});

const buildMemberships = async (
  userId: number,
): Promise<AuthResponse["memberships"]> => {
  const memberships = await authRepo.listMembershipsWithWorkspaceByUser(userId);

  return memberships.map(toMembershipSummary);
};

const issueTokenPair = async (userId: number, workspaceId: number) => {
  const refreshExpiry = new Date(
    Date.now() + env.AUTH_REFRESH_TOKEN_TTL_SECONDS * 1000,
  );

  const session = await authRepo.createSession({
    userId,
    workspaceId,
    refreshTokenHash: "",
    expiresAt: refreshExpiry,
  });

  const [accessToken, refreshToken] = await Promise.all([
    createAuthToken({
      userId,
      workspaceId,
      sessionId: session.id,
      type: "access",
      ttlSeconds: env.AUTH_ACCESS_TOKEN_TTL_SECONDS,
      secret: env.AUTH_ACCESS_TOKEN_SECRET,
    }),
    createAuthToken({
      userId,
      workspaceId,
      sessionId: session.id,
      type: "refresh",
      ttlSeconds: env.AUTH_REFRESH_TOKEN_TTL_SECONDS,
      secret: env.AUTH_REFRESH_TOKEN_SECRET,
    }),
  ]);

  await authRepo.updateSessionRefreshTokenHash(
    session.id,
    hashToken(refreshToken),
  );

  return {
    accessToken,
    refreshToken,
    accessTokenTtlSeconds: env.AUTH_ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenTtlSeconds: env.AUTH_REFRESH_TOKEN_TTL_SECONDS,
  };
};

// There is no explicit "default workspace" flag on a membership. `listMembershipsByUser` orders
// by membership id ascending, so the earliest-created membership (typically the workspace made
// at registration) is what login lands the user in.
const selectWorkspaceIdForLogin = async (
  userId: number,
): Promise<{ workspaceId: number; role: AuthRole }> => {
  const memberships = await authRepo.listMembershipsByUser(userId);

  if (memberships.length === 0) {
    throw createAppError(ERROR_CODES.auth.NO_WORKSPACE_MEMBERSHIP);
  }

  const defaultMembership = memberships[0];

  if (!defaultMembership) {
    throw createAppError(ERROR_CODES.auth.NO_WORKSPACE_MEMBERSHIP);
  }

  return {
    workspaceId: defaultMembership.workspaceId,
    role: defaultMembership.role,
  };
};

const toAuthResponse = async (
  user: AuthUser,
  workspace: Workspace,
  role: AuthRole,
  tokens: AuthResponse["tokens"],
): Promise<AuthResponse> => {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    workspace: toWorkspaceSummary(workspace, role),
    memberships: await buildMemberships(user.id),
    tokens,
  };
};

export const authService = {
  async register(payload: RegisterInput): Promise<AuthResponse> {
    const existingUser = await authRepo.findUserByEmail(payload.email);

    if (existingUser) {
      throw createAppError(ERROR_CODES.auth.EMAIL_ALREADY_IN_USE);
    }

    const passwordHash = await hashPassword(payload.password);

    const { user, workspace, membership } = await withAuthTransaction(
      async (tx) => {
        const user = await authRepo.createUser(
          {
            name: payload.name,
            email: payload.email,
            passwordHash,
          },
          tx,
        );

        const workspace = await authRepo.createWorkspace(
          {
            name:
              payload.accountType === "team"
                ? payload.teamName
                : createWorkspaceNameForSingleAccount(payload.name),
            type: payload.accountType === "team" ? "team" : "personal",
            createdByUserId: user.id,
          },
          tx,
        );

        const membership = await authRepo.createMembership(
          {
            userId: user.id,
            workspaceId: workspace.id,
            role: "owner",
          },
          tx,
        );

        return { user, workspace, membership };
      },
    );

    const tokens = await issueTokenPair(user.id, workspace.id);

    return toAuthResponse(user, workspace, membership.role, tokens);
  },

  async login(payload: LoginInput): Promise<AuthResponse> {
    const user = await authRepo.findUserByEmail(payload.email);

    if (!user || !(await verifyPassword(payload.password, user.passwordHash))) {
      throw createAppError(ERROR_CODES.auth.INVALID_CREDENTIALS);
    }

    const { workspaceId, role } = await selectWorkspaceIdForLogin(user.id);
    const workspace = await authRepo.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw createAppError(ERROR_CODES.workspaces.NOT_FOUND);
    }

    const tokens = await issueTokenPair(user.id, workspace.id);

    return toAuthResponse(user, workspace, role, tokens);
  },

  async refresh(payload: RefreshTokenInput): Promise<AuthResponse> {
    const tokenPayload = await verifyRefreshToken(
      payload.refreshToken,
      env.AUTH_REFRESH_TOKEN_SECRET,
    );

    if (!tokenPayload) {
      throw createAppError(ERROR_CODES.auth.INVALID_REFRESH_TOKEN);
    }

    const session = await authRepo.findSessionById(tokenPayload.sid);

    if (
      !session ||
      session.revokedAt !== null ||
      session.expiresAt.getTime() <= Date.now() ||
      session.userId !== tokenPayload.sub ||
      session.workspaceId !== tokenPayload.wid ||
      session.refreshTokenHash !== hashToken(payload.refreshToken)
    ) {
      throw createAppError(ERROR_CODES.auth.REFRESH_SESSION_INVALID);
    }

    const authContext = await authRepo.findAuthContext(
      session.userId,
      session.workspaceId,
    );

    if (!authContext) {
      throw createAppError(ERROR_CODES.auth.REFRESH_SESSION_INVALID);
    }

    const { user, workspace, role } = authContext;

    await authRepo.revokeSessionById(session.id);
    const tokens = await issueTokenPair(user.id, workspace.id);

    return toAuthResponse(user, workspace, role, tokens);
  },

  async logout(payload: RefreshTokenInput): Promise<void> {
    const tokenPayload = await verifyRefreshToken(
      payload.refreshToken,
      env.AUTH_REFRESH_TOKEN_SECRET,
    );

    if (!tokenPayload) {
      return;
    }

    await authRepo.revokeSessionById(tokenPayload.sid);
  },

  async getMe(context: AuthContext): Promise<Omit<AuthResponse, "tokens">> {
    const authContext = await authRepo.findAuthContext(
      context.userId,
      context.workspaceId,
    );

    if (!authContext) {
      throw createAppError(ERROR_CODES.common.AUTH_CONTEXT_INVALID);
    }

    const { user, workspace, role } = authContext;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      workspace: toWorkspaceSummary(workspace, role),
      memberships: await buildMemberships(user.id),
    };
  },
};
