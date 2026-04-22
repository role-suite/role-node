import type { Request, Response } from "express";

import { createAppError, sendAppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

export const notFoundHandler = (req: Request, res: Response): void => {
  sendAppError(
    res,
    createAppError(ERROR_CODES.common.ROUTE_NOT_FOUND, {
      details: {
        method: req.method,
        path: req.originalUrl,
      },
    }),
  );
};
