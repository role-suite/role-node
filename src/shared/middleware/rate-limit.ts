import type { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";

import { env } from "../../config/env.js";
import { createAppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";
import { errorHandler } from "../errors/error-handler.js";

const rateLimitHandler = (req: Request, res: Response): void => {
  errorHandler(
    createAppError(ERROR_CODES.common.RATE_LIMIT_EXCEEDED),
    req,
    res,
    () => {},
  );
};

const skipInTestEnv = (): boolean => env.NODE_ENV === "test";

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: skipInTestEnv,
  handler: rateLimitHandler,
});

export const authRateLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  limit: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: skipInTestEnv,
  handler: rateLimitHandler,
});
