import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  switchWorkspaceSchema,
} from "./schema.js";
import { authService } from "./service.js";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const payload = registerSchema.parse(req.body);
    const result = await authService.register(payload);
    appResponse.sendObject(res, 201, result);
  },

  async login(req: Request, res: Response): Promise<void> {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login(payload);
    appResponse.sendObject(res, 200, result);
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const payload = refreshTokenSchema.parse(req.body);
    const result = await authService.refresh(payload);
    appResponse.sendObject(res, 200, result);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const payload = refreshTokenSchema.parse(req.body);
    await authService.logout(payload);
    appResponse.sendAction(res, 200, "revoked");
  },

  async switchWorkspace(req: Request, res: Response): Promise<void> {
    if (!req.auth) {
      throw createAppError(ERROR_CODES.common.MISSING_AUTHENTICATED_CONTEXT);
    }

    const payload = switchWorkspaceSchema.parse(req.body);
    const result = await authService.switchWorkspace(
      req.auth,
      payload.workspaceId,
    );
    appResponse.sendObject(res, 200, result);
  },

  async me(req: Request, res: Response): Promise<void> {
    if (!req.auth) {
      throw createAppError(ERROR_CODES.common.MISSING_AUTHENTICATED_CONTEXT);
    }

    const result = await authService.getMe(req.auth);
    appResponse.sendObject(res, 200, result);
  },
};
