import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { env } from "../../config/env.js";
import { logger } from "../logger.js";
import { AppError, createAppError, sendAppError } from "./app-error.js";
import { ERROR_CODES } from "./error-codes.js";

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

const hasNonNumericCollectionIdParam = (req: Request): boolean => {
  const urlParams = parsePathParamsFromUrl(req.originalUrl);
  const mergedParams = { ...(req.params ?? {}), ...urlParams };

  return (
    typeof mergedParams.collectionId === "string" &&
    !isPositiveIntegerString(mergedParams.collectionId)
  );
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const requestId =
    typeof res.locals === "object" &&
    res.locals !== null &&
    typeof res.locals.requestId === "string"
      ? res.locals.requestId
      : "unknown";

  if (error instanceof ZodError) {
    const parsedUrlParams = parsePathParamsFromUrl(req.originalUrl);

    logger.warn("Request validation failed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      params: req.params,
      parsedUrlParams,
      query: req.query,
      issues: error.issues,
    });

    if (hasPlaceholderRouteParam(req) || hasNonNumericCollectionIdParam(req)) {
      sendAppError(
        res,
        createAppError(ERROR_CODES.common.INVALID_URL_PARAMETERS, {
          message:
            "Invalid URL parameters: workspaceId/collectionId must be numeric IDs from `id` (or `_id`) in API responses",
          details: {
            params: {
              ...(req.params ?? {}),
              ...parsedUrlParams,
            },
            fieldErrors: error.flatten().fieldErrors,
          },
        }),
      );
      return;
    }

    sendAppError(
      res,
      createAppError(ERROR_CODES.common.VALIDATION_FAILED, {
        details: {
          fieldErrors: error.flatten().fieldErrors,
        },
      }),
    );
    return;
  }

  if (error instanceof AppError) {
    sendAppError(res, error);
    return;
  }

  if (env.NODE_ENV === "development") {
    if (error instanceof Error) {
      logger.error("Unhandled error", {
        requestId,
        name: error.name,
        message: error.message,
        cause: (error as Error & { cause?: unknown }).cause,
      });
    } else {
      logger.error("Unhandled error", { requestId, error });
    }
  }

  const details =
    env.NODE_ENV === "development" && error instanceof Error
      ? { cause: error.message }
      : {};

  sendAppError(
    res,
    createAppError(ERROR_CODES.common.INTERNAL_SERVER_ERROR, {
      details,
    }),
  );
};
