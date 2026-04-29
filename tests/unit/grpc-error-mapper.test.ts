import { status } from "@grpc/grpc-js";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { toGrpcServiceError } from "../../src/grpc/interceptors/error-mapper.js";
import { createAppError } from "../../src/shared/errors/app-error.js";
import { ERROR_CODES } from "../../src/shared/errors/error-codes.js";

describe("grpc error mapper", () => {
  it("maps AppError to grpc status and metadata", () => {
    const appError = createAppError(ERROR_CODES.common.MISSING_ACCESS_TOKEN);
    const serviceError = toGrpcServiceError(appError, "req-1");

    expect(serviceError.code).toBe(status.UNAUTHENTICATED);
    expect(serviceError.metadata.get("x-request-id")[0]).toBe("req-1");
    expect(serviceError.metadata.get("x-error-code")[0]).toBe(
      "MISSING_ACCESS_TOKEN",
    );
  });

  it("maps ZodError to invalid argument", () => {
    const schema = z.object({ id: z.number() });
    const result = schema.safeParse({ id: "oops" });

    if (result.success) {
      throw new Error("Expected schema parse to fail");
    }

    const serviceError = toGrpcServiceError(result.error, "req-2");
    expect(serviceError.code).toBe(status.INVALID_ARGUMENT);
  });
});
