import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "./auth.schema.js";
import { authService } from "./auth.service.js";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const payload = registerSchema.parse(req.body);
    const result = await authService.register(payload);
    appResponse.sendSuccess(res, 201, result);
  },

  async login(req: Request, res: Response): Promise<void> {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login(payload);
    appResponse.sendSuccess(res, 200, result);
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const payload = refreshTokenSchema.parse(req.body);
    const result = await authService.refresh(payload);
    appResponse.sendSuccess(res, 200, result);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const payload = refreshTokenSchema.parse(req.body);
    await authService.logout(payload);
    appResponse.sendSuccess(res, 200, { loggedOut: true });
  },

  async me(req: Request, res: Response): Promise<void> {
    if (!req.auth) {
      throw appResponse.withStatus(401, "Missing authenticated context");
    }

    const result = await authService.getMe(req.auth);
    appResponse.sendSuccess(res, 200, result);
  },
};
