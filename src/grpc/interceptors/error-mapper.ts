import { Metadata, status, type ServiceError } from "@grpc/grpc-js";
import { ZodError } from "zod";

import { AppError } from "../../shared/errors/app-error.js";

const httpStatusToGrpcStatus = (httpStatus: number): status => {
  if (httpStatus === 400) {
    return status.INVALID_ARGUMENT;
  }

  if (httpStatus === 401) {
    return status.UNAUTHENTICATED;
  }

  if (httpStatus === 403) {
    return status.PERMISSION_DENIED;
  }

  if (httpStatus === 404) {
    return status.NOT_FOUND;
  }

  if (httpStatus === 409) {
    return status.ALREADY_EXISTS;
  }

  if (httpStatus === 410) {
    return status.FAILED_PRECONDITION;
  }

  if (httpStatus >= 500) {
    return status.INTERNAL;
  }

  return status.UNKNOWN;
};

const withErrorMetadata = (
  requestId: string,
  extras?: Record<string, string>,
): Metadata => {
  const metadata = new Metadata();
  metadata.set("x-request-id", requestId);

  for (const [key, value] of Object.entries(extras ?? {})) {
    metadata.set(key, value);
  }

  return metadata;
};

export const toGrpcServiceError = (
  error: unknown,
  requestId: string,
): ServiceError => {
  if (error instanceof AppError) {
    const metadata = withErrorMetadata(requestId, {
      "x-error-code": error.code,
      "x-error-details": JSON.stringify(error.details ?? {}),
    });

    return {
      name: "GrpcAppError",
      message: error.message,
      code: httpStatusToGrpcStatus(error.statusCode),
      details: error.message,
      metadata,
    };
  }

  if (error instanceof ZodError) {
    const metadata = withErrorMetadata(requestId, {
      "x-error-code": "VALIDATION_FAILED",
      "x-error-details": JSON.stringify(error.flatten().fieldErrors),
    });

    return {
      name: "GrpcValidationError",
      message: "Validation failed",
      code: status.INVALID_ARGUMENT,
      details: "Validation failed",
      metadata,
    };
  }

  const metadata = withErrorMetadata(requestId, {
    "x-error-code": "INTERNAL_SERVER_ERROR",
  });

  return {
    name: "GrpcUnhandledError",
    message: "Internal server error",
    code: status.INTERNAL,
    details: "Internal server error",
    metadata,
  };
};
