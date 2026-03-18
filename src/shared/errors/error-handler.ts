import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { env } from "../../config/env.js";
import { appResponse } from "../app-response.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    appResponse.sendError(
      res,
      400,
      "Validation failed",
      error.flatten().fieldErrors,
    );
    return;
  }

  if (appResponse.isErrorWithStatus(error)) {
    appResponse.sendError(res, error.statusCode, error.message, error.data);
    return;
  }

  appResponse.sendError(
    res,
    500,
    "Internal server error",
    env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : undefined,
  );
};
