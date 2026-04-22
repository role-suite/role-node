import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

import { logger } from "../logger.js";

const REQUEST_ID_HEADER = "x-request-id";

const resolveRequestId = (req: Request): string => {
  if (req.requestId && req.requestId.trim().length > 0) {
    return req.requestId;
  }

  const incomingRequestId = req.header(REQUEST_ID_HEADER);

  if (incomingRequestId && incomingRequestId.trim().length > 0) {
    return incomingRequestId;
  }

  return randomUUID();
};

const normalizeIp = (ip: string): string => {
  if (ip === "::1") {
    return "127.0.0.1";
  }

  if (ip.startsWith("::ffff:")) {
    return ip.slice(7);
  }

  return ip;
};

const resolveClientIp = (req: Request): string => {
  const forwardedFor = req.header("x-forwarded-for");

  if (forwardedFor) {
    const firstForwardedIp = forwardedFor.split(",")[0]?.trim();

    if (firstForwardedIp) {
      return normalizeIp(firstForwardedIp);
    }
  }

  const realIp = req.header("x-real-ip");

  if (realIp && realIp.trim().length > 0) {
    return normalizeIp(realIp.trim());
  }

  const socketIp = req.socket?.remoteAddress;

  if (socketIp) {
    return normalizeIp(socketIp);
  }

  return normalizeIp(req.ip ?? "unknown");
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const requestId = resolveRequestId(req);
  const clientIp = resolveClientIp(req);
  const startedAt = process.hrtime.bigint();
  let completed = false;

  if (!req.requestId) {
    req.requestId = requestId;
  }

  if (!res.locals.requestId) {
    res.locals.requestId = requestId;
  }

  if (!res.getHeader(REQUEST_ID_HEADER)) {
    res.setHeader(REQUEST_ID_HEADER, requestId);
  }

  res.on("finish", () => {
    completed = true;
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    logger.info("HTTP request completed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: clientIp,
    });
  });

  res.on("close", () => {
    if (completed) {
      return;
    }

    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    logger.warn("HTTP request closed before completion", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: clientIp,
    });
  });

  next();
};
