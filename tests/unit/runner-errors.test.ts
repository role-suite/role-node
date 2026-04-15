import { describe, expect, it } from "vitest";

import {
  RunnerError,
  toRunnerPublicError,
} from "../../src/internal/runner/errors/runner-errors.js";

describe("runner errors", () => {
  describe("RunnerError", () => {
    it("creates error with code and message", () => {
      const error = new RunnerError("RUN_TIMEOUT", "Request timed out");

      expect(error.name).toBe("RunnerError");
      expect(error.code).toBe("RUN_TIMEOUT");
      expect(error.message).toBe("Request timed out");
    });

    it("creates error with details", () => {
      const error = new RunnerError("RUN_NETWORK_ERROR", "Connection failed", {
        statusCode: 500,
      });

      expect(error.code).toBe("RUN_NETWORK_ERROR");
      expect(error.details).toEqual({ statusCode: 500 });
    });
  });

  describe("toRunnerPublicError", () => {
    it("converts RunnerError", () => {
      const error = new RunnerError("RUN_TIMEOUT", "Request timed out");
      const publicError = toRunnerPublicError(error);

      expect(publicError).toEqual({
        code: "RUN_TIMEOUT",
        message: "Request timed out",
      });
    });

    it("converts RunnerError with details", () => {
      const error = new RunnerError("RUN_NETWORK_ERROR", "Connection failed", {
        statusCode: 500,
      });
      const publicError = toRunnerPublicError(error);

      expect(publicError).toEqual({
        code: "RUN_NETWORK_ERROR",
        message: "Connection failed",
        details: { statusCode: 500 },
      });
    });

    it("converts AbortError to RUN_TIMEOUT", () => {
      const abortError = new Error("AbortError");
      abortError.name = "AbortError";

      const publicError = toRunnerPublicError(abortError);

      expect(publicError).toEqual({
        code: "RUN_TIMEOUT",
        message: "Request timed out",
      });
    });

    it("converts generic Error to RUN_NETWORK_ERROR", () => {
      const error = new Error("Connection refused");

      const publicError = toRunnerPublicError(error);

      expect(publicError).toEqual({
        code: "RUN_NETWORK_ERROR",
        message: "Connection refused",
      });
    });

    it("converts unknown error to internal error", () => {
      const publicError = toRunnerPublicError("something went wrong");

      expect(publicError).toEqual({
        code: "RUN_INTERNAL_ERROR",
        message: "Internal runner error",
      });
    });
  });
});
