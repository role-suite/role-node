import { Router } from "express";

import { ROUTE_SEGMENTS } from "../../shared/http/routes.js";
import { requireAuth } from "../../shared/middleware/require-auth.js";
import { authController } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post(ROUTE_SEGMENTS.auth.register, authController.register);
authRouter.post(ROUTE_SEGMENTS.auth.login, authController.login);
authRouter.post(ROUTE_SEGMENTS.auth.refresh, authController.refresh);
authRouter.post(ROUTE_SEGMENTS.auth.logout, authController.logout);
authRouter.get(ROUTE_SEGMENTS.auth.me, requireAuth, authController.me);
