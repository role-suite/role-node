import type {
  RunnerPublicError,
  RunnerPublicErrorCode,
} from "../core/types.js";

export class RunnerError extends Error {
  readonly code: RunnerPublicErrorCode;
  readonly details: Record<string, unknown> | undefined;

  constructor(
    code: RunnerPublicErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "RunnerError";
    this.code = code;
    this.details = details;
  }
}

export const toRunnerPublicError = (error: unknown): RunnerPublicError => {
  if (error instanceof RunnerError) {
    return {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    };
  }

  if (error instanceof Error && error.name === "AbortError") {
    return {
      code: "RUN_TIMEOUT",
      message: "Request timed out",
    };
  }

  if (error instanceof Error) {
    return {
      code: "RUN_NETWORK_ERROR",
      message: error.message,
    };
  }

  return {
    code: "RUN_INTERNAL_ERROR",
    message: "Internal runner error",
  };
};
