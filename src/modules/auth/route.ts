import { Router } from "express";

import { ROUTE_SEGMENTS } from "../../shared/routes.js";
import { requireAuth } from "../../shared/middleware/require-auth.js";
import { authRateLimiter } from "../../shared/middleware/rate-limit.js";
import { authController } from "./controller.js";

export const authRouter = Router();

authRouter.post(
  ROUTE_SEGMENTS.auth.register,
  authRateLimiter,
  authController.register,
);
authRouter.post(
  ROUTE_SEGMENTS.auth.login,
  authRateLimiter,
  authController.login,
);
authRouter.post(
  ROUTE_SEGMENTS.auth.refresh,
  authRateLimiter,
  authController.refresh,
);
authRouter.post(ROUTE_SEGMENTS.auth.logout, authController.logout);
authRouter.get(ROUTE_SEGMENTS.auth.me, requireAuth, authController.me);
