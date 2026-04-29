import { Metadata } from "@grpc/grpc-js";

import { env } from "../../config/env.js";
import { authRepo } from "../../modules/auth/auth.repo.js";
import {
  verifyAccessToken,
  type AuthTokenPayload,
} from "../../shared/auth/tokens.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";

const AUTHORIZATION_METADATA_KEY = "authorization";

const getBearerToken = (
  authorizationValue: string | undefined,
): string | null => {
  if (!authorizationValue) {
    return null;
  }

  const [type, token] = authorizationValue.split(" ");

  if (type !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const readAuthorizationMetadata = (metadata: Metadata): string | undefined => {
  const value = metadata.get(AUTHORIZATION_METADATA_KEY)[0];

  if (typeof value !== "string") {
    return undefined;
  }

  return value.trim();
};

export const resolveAccessTokenPayload = (
  metadata: Metadata,
): AuthTokenPayload => {
  const bearerToken = getBearerToken(readAuthorizationMetadata(metadata));

  if (!bearerToken) {
    throw createAppError(ERROR_CODES.common.MISSING_ACCESS_TOKEN);
  }

  const payload = verifyAccessToken(bearerToken, env.AUTH_ACCESS_TOKEN_SECRET);

  if (!payload) {
    throw createAppError(ERROR_CODES.common.INVALID_ACCESS_TOKEN);
  }

  return payload;
};

export const resolveAuthenticatedContext = async (metadata: Metadata) => {
  const payload = resolveAccessTokenPayload(metadata);
  const [user, workspace, membership] = await Promise.all([
    authRepo.findUserById(payload.sub),
    authRepo.findWorkspaceById(payload.wid),
    authRepo.findMembershipByUserAndWorkspace(payload.sub, payload.wid),
  ]);

  if (!user || !workspace || !membership) {
    throw createAppError(ERROR_CODES.common.AUTH_CONTEXT_INVALID);
  }

  return {
    userId: user.id,
    workspaceId: workspace.id,
    sessionId: payload.sid,
    role: membership.role,
  };
};
