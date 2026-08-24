import type { NextFunction, Request, Response } from "express";

const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "x-permitted-cross-domain-policies": "none",
  "referrer-policy": "no-referrer",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
} as const;

const HSTS_HEADER_VALUE = "max-age=15552000; includeSubDomains";

const isRequestOverHttps = (req: Request): boolean => {
  return req.secure || req.header("x-forwarded-proto") === "https";
};

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(name, value);
  }

  if (isRequestOverHttps(req)) {
    res.setHeader("strict-transport-security", HSTS_HEADER_VALUE);
  }

  next();
};
