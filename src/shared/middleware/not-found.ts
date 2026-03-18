import type { Request, Response } from "express";

import { appResponse } from "../app-response.js";

export const notFoundHandler = (req: Request, res: Response): void => {
  appResponse.sendError(
    res,
    404,
    `Route not found: ${req.method} ${req.originalUrl}`,
  );
};
