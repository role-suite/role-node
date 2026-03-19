import type { NextFunction, Request, Response } from "express";

import { env } from "../../config/env.js";
import { verifyAccessToken } from "../auth/tokens.js";
import { appResponse } from "../app-response.js";
import { authRepo } from "../../modules/auth/auth.repo.js";

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
    throw appResponse.withStatus(401, "Missing access token");
  }

  const payload = verifyAccessToken(token, env.AUTH_ACCESS_TOKEN_SECRET);

  if (!payload) {
    throw appResponse.withStatus(401, "Invalid access token");
  }

  const user = await authRepo.findUserById(payload.sub);
  const workspace = await authRepo.findWorkspaceById(payload.wid);
  const membership = await authRepo.findMembershipByUserAndWorkspace(
    payload.sub,
    payload.wid,
  );

  if (!user || !workspace || !membership) {
    throw appResponse.withStatus(401, "Authenticated context is invalid");
  }

  req.auth = {
    userId: user.id,
    workspaceId: workspace.id,
    role: membership.role,
    sessionId: payload.sid,
  };

  next();
};
