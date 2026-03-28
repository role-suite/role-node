import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { env } from "../../config/env.js";
import { appResponse } from "../app-response.js";
import { logger } from "../logger.js";

const ID_PLACEHOLDER_VALUES = new Set(["unknown", "default"]);

const parsePathParamsFromUrl = (
  url: string | undefined,
): Record<string, string> => {
  const pathname = (url ?? "").split("?")[0] ?? "";
  const segments = pathname.split("/").filter((segment) => segment.length > 0);

  const workspacesIndex = segments.indexOf("workspaces");

  if (workspacesIndex === -1) {
    return {};
  }

  const workspaceId = segments[workspacesIndex + 1];

  if (!workspaceId) {
    return {};
  }

  const collectionsIndex = segments.indexOf("collections");
  const collectionId =
    collectionsIndex !== -1 ? segments[collectionsIndex + 1] : undefined;

  return {
    workspaceId,
    ...(collectionId ? { collectionId } : {}),
  };
};

const isPositiveIntegerString = (value: string): boolean => {
  return /^[1-9]\d*$/.test(value);
};

const hasPlaceholderRouteParam = (req: Request): boolean => {
  const urlParams = parsePathParamsFromUrl(req.originalUrl);
  const params = Object.values({ ...(req.params ?? {}), ...urlParams });

  return params.some((value) => {
    if (typeof value !== "string") {
      return false;
    }

    return ID_PLACEHOLDER_VALUES.has(value.trim().toLowerCase());
  });
};

const hasNonNumericIdParam = (req: Request): boolean => {
  const urlParams = parsePathParamsFromUrl(req.originalUrl);
  const mergedParams = { ...(req.params ?? {}), ...urlParams };

  const idCandidates = [
    mergedParams.workspaceId,
    mergedParams.collectionId,
  ].filter((value): value is string => typeof value === "string");

  return idCandidates.some((value) => !isPositiveIntegerString(value));
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    const parsedUrlParams = parsePathParamsFromUrl(req.originalUrl);

    logger.warn("Request validation failed", {
      method: req.method,
      path: req.originalUrl,
      params: req.params,
      parsedUrlParams,
      query: req.query,
      issues: error.issues,
    });

    if (hasPlaceholderRouteParam(req) || hasNonNumericIdParam(req)) {
      appResponse.sendError(
        res,
        400,
        "Invalid URL parameters: workspaceId/collectionId must be numeric IDs from `id` (or `_id`) in API responses",
        {
          params: {
            ...(req.params ?? {}),
            ...parsedUrlParams,
          },
          fieldErrors: error.flatten().fieldErrors,
        },
      );
      return;
    }

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
