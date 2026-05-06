import { env } from "../../config/env.js";
import {
  hashPassword,
  hashToken,
  verifyPassword,
} from "../../shared/auth/password.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import {
  recordDomainMetric,
  withDomainSpan,
} from "../../shared/telemetry-domain.js";
import {
  createAuthToken,
  verifyRefreshToken,
} from "../../shared/auth/tokens.js";

import { authRepo, type AuthUser, type Workspace } from "./auth.repo.js";
import type {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from "./auth.schema.js";

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

const buildMemberships = async (
  userId: number,
): Promise<AuthResponse["memberships"]> => {
  const memberships = await authRepo.listMembershipsByUser(userId);

  const hydrated = await Promise.all(
    memberships.map(async (membership) => {
      const workspace = await authRepo.findWorkspaceById(
        membership.workspaceId,
      );

      if (!workspace) {
        return null;
      }

      return {
        workspaceId: workspace.id,
        _id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        type: workspace.type,
        role: membership.role,
      };
    }),
  );

  return hydrated.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
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

  const accessToken = createAuthToken({
    userId,
    workspaceId,
    sessionId: session.id,
    type: "access",
    ttlSeconds: env.AUTH_ACCESS_TOKEN_TTL_SECONDS,
    secret: env.AUTH_ACCESS_TOKEN_SECRET,
  });

  const refreshToken = createAuthToken({
    userId,
    workspaceId,
    sessionId: session.id,
    type: "refresh",
    ttlSeconds: env.AUTH_REFRESH_TOKEN_TTL_SECONDS,
    secret: env.AUTH_REFRESH_TOKEN_SECRET,
  });

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
    workspace: {
      id: workspace.id,
      _id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      type: workspace.type,
      role,
    },
    memberships: await buildMemberships(user.id),
    tokens,
  };
};

export const authService = {
  async register(payload: RegisterInput): Promise<AuthResponse> {
    return withDomainSpan(
      "auth",
      "register",
      { "auth.account_type": payload.accountType },
      async () => {
        const existingUser = await authRepo.findUserByEmail(payload.email);

        if (existingUser) {
          recordDomainMetric.auth("register", "error");
          throw createAppError(ERROR_CODES.auth.EMAIL_ALREADY_IN_USE);
        }

        const user = await authRepo.createUser({
          name: payload.name,
          email: payload.email,
          passwordHash: hashPassword(payload.password),
        });

        const workspace = await authRepo.createWorkspace({
          name:
            payload.accountType === "team"
              ? (payload.teamName ?? "Team Workspace")
              : createWorkspaceNameForSingleAccount(payload.name),
          type: payload.accountType === "team" ? "team" : "personal",
          createdByUserId: user.id,
        });

        const membership = await authRepo.createMembership({
          userId: user.id,
          workspaceId: workspace.id,
          role: "owner",
        });

        const tokens = await issueTokenPair(user.id, workspace.id);
        recordDomainMetric.auth("register", "success");

        return toAuthResponse(user, workspace, membership.role, tokens);
      },
    );
  },

  async login(payload: LoginInput): Promise<AuthResponse> {
    return withDomainSpan("auth", "login", {}, async () => {
      const user = await authRepo.findUserByEmail(payload.email);

      if (!user || !verifyPassword(payload.password, user.passwordHash)) {
        recordDomainMetric.auth("login", "error");
        throw createAppError(ERROR_CODES.auth.INVALID_CREDENTIALS);
      }

      const { workspaceId, role } = await selectWorkspaceIdForLogin(user.id);
      const workspace = await authRepo.findWorkspaceById(workspaceId);

      if (!workspace) {
        recordDomainMetric.auth("login", "error");
        throw createAppError(ERROR_CODES.workspaces.WORKSPACE_NOT_FOUND);
      }

      const tokens = await issueTokenPair(user.id, workspace.id);
      recordDomainMetric.auth("login", "success");

      return toAuthResponse(user, workspace, role, tokens);
    });
  },

  async refresh(payload: RefreshTokenInput): Promise<AuthResponse> {
    return withDomainSpan("auth", "refresh", {}, async () => {
      const tokenPayload = verifyRefreshToken(
        payload.refreshToken,
        env.AUTH_REFRESH_TOKEN_SECRET,
      );

      if (!tokenPayload) {
        recordDomainMetric.auth("refresh", "error");
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
        recordDomainMetric.auth("refresh", "error");
        throw createAppError(ERROR_CODES.auth.REFRESH_SESSION_INVALID);
      }

      const user = await authRepo.findUserById(session.userId);
      const workspace = await authRepo.findWorkspaceById(session.workspaceId);
      const membership = await authRepo.findMembershipByUserAndWorkspace(
        session.userId,
        session.workspaceId,
      );

      if (!user || !workspace || !membership) {
        recordDomainMetric.auth("refresh", "error");
        throw createAppError(ERROR_CODES.auth.REFRESH_SESSION_INVALID);
      }

      await authRepo.revokeSessionById(session.id);
      const tokens = await issueTokenPair(user.id, workspace.id);
      recordDomainMetric.auth("refresh", "success");

      return toAuthResponse(user, workspace, membership.role, tokens);
    });
  },

  async logout(payload: RefreshTokenInput): Promise<void> {
    return withDomainSpan("auth", "logout", {}, async () => {
      const tokenPayload = verifyRefreshToken(
        payload.refreshToken,
        env.AUTH_REFRESH_TOKEN_SECRET,
      );

      if (!tokenPayload) {
        recordDomainMetric.auth("logout", "success");
        return;
      }

      await authRepo.revokeSessionById(tokenPayload.sid);
      recordDomainMetric.auth("logout", "success");
    });
  },

  async getMe(context: AuthContext): Promise<Omit<AuthResponse, "tokens">> {
    return withDomainSpan(
      "auth",
      "get_me",
      {},
      async (): Promise<Omit<AuthResponse, "tokens">> => {
        const user = await authRepo.findUserById(context.userId);
        const workspace = await authRepo.findWorkspaceById(context.workspaceId);
        const membership = await authRepo.findMembershipByUserAndWorkspace(
          context.userId,
          context.workspaceId,
        );

        if (!user || !workspace || !membership) {
          recordDomainMetric.auth("get_me", "error");
          throw createAppError(ERROR_CODES.common.AUTH_CONTEXT_INVALID);
        }

        recordDomainMetric.auth("get_me", "success");
        return {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          workspace: {
            id: workspace.id,
            _id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            type: workspace.type,
            role: membership.role,
          },
          memberships: await buildMemberships(user.id),
        };
      },
    );
  },
};
