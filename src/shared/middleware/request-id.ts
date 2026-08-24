import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

import { runWithRequestContext } from "../request-context.js";

export const REQUEST_ID_HEADER = "x-request-id";

export const REQUEST_ID_PATTERN = /^[a-zA-Z0-9._:-]{1,128}$/;

const resolveRequestId = (req: Request): string => {
  const incomingRequestId = req.header(REQUEST_ID_HEADER);

  if (incomingRequestId) {
    const trimmedRequestId = incomingRequestId.trim();

    if (REQUEST_ID_PATTERN.test(trimmedRequestId)) {
      return trimmedRequestId;
    }
  }

  return randomUUID();
};

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const requestId = resolveRequestId(req);

  req.requestId = requestId;
  res.locals.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  runWithRequestContext(requestId, () => {
    next();
  });
};
