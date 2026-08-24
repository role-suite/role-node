import type { NextFunction, Request, Response } from "express";

import { env } from "../../config/env.js";
import { verifyAccessToken } from "../auth/tokens.js";
import { authRepo } from "../../modules/auth/repo.js";
import { createAppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

const getBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [type, token] = authorizationHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = getBearerToken(req.header("authorization"));

  if (!token) {
    throw createAppError(ERROR_CODES.common.MISSING_ACCESS_TOKEN);
  }

  const payload = await verifyAccessToken(token, env.AUTH_ACCESS_TOKEN_SECRET);

  if (!payload) {
    throw createAppError(ERROR_CODES.common.INVALID_ACCESS_TOKEN);
  }

  const context = await authRepo.findAuthContext(payload.sub, payload.wid);

  if (!context) {
    throw createAppError(ERROR_CODES.common.AUTH_CONTEXT_INVALID);
  }

  req.auth = {
    userId: context.user.id,
    workspaceId: context.workspace.id,
    role: context.role,
    sessionId: payload.sid,
  };

  next();
};
