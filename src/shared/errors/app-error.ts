import type { Response } from "express";

import { getRequestIdFromContext } from "../request-context.js";
import { ERROR_CODE_DEFINITIONS, type ErrorCode } from "./error-codes.js";

export type ApiErrorEnvelope = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details: Record<string, unknown>;
    requestId: string;
  };
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    options?: {
      message?: string;
      statusCode?: number;
      details?: Record<string, unknown>;
    },
  ) {
    const definition = ERROR_CODE_DEFINITIONS[code];
    const message = options?.message ?? definition.message;

    super(message);

    this.name = "AppError";
    this.code = code;
    this.statusCode = options?.statusCode ?? definition.status;
    this.details = options?.details ?? {};
  }
}

export const createAppError = (
  code: ErrorCode,
  options?: {
    message?: string;
    statusCode?: number;
    details?: Record<string, unknown>;
  },
): AppError => {
  return new AppError(code, options);
};

const resolveRequestId = (res: Response): string => {
  const contextRequestId = getRequestIdFromContext();

  if (contextRequestId && contextRequestId.trim().length > 0) {
    return contextRequestId;
  }

  const requestId =
    typeof res.locals === "object" && res.locals !== null
      ? res.locals.requestId
      : undefined;

  if (typeof requestId === "string" && requestId) {
    return requestId;
  }

  return "unknown";
};

export const formatErrorEnvelope = (
  error: AppError,
  requestId: string,
): ApiErrorEnvelope => {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
      requestId,
    },
  };
};

export const sendAppError = (res: Response, error: AppError): void => {
  const requestId = resolveRequestId(res);
  res.status(error.statusCode).json(formatErrorEnvelope(error, requestId));
};
