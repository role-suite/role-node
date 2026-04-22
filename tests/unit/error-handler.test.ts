import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createAppError } from "../../src/shared/errors/app-error.js";
import { ERROR_CODES } from "../../src/shared/errors/error-codes.js";
import { errorHandler } from "../../src/shared/errors/error-handler.js";

const makeResponse = () => {
  const response = {
    locals: {
      requestId: "req_test",
    },
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockReturnValue(response);

  return response;
};

describe("error handler", () => {
  it("handles zod errors", () => {
    const response = makeResponse();
    const schema = z.object({ email: z.email() });
    const result = schema.safeParse({ email: "bad" });

    if (result.success) {
      throw new Error("Expected schema parse to fail");
    }

    errorHandler(result.error, {} as never, response as never, vi.fn());

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "VALIDATION_FAILED",
          message: "Validation failed",
          requestId: "req_test",
        }),
      }),
    );
  });

  it("returns targeted message for placeholder route params", () => {
    const response = makeResponse();
    const schema = z.object({
      workspaceId: z.coerce.number().int().positive(),
    });
    const result = schema.safeParse({ workspaceId: "unknown" });

    if (result.success) {
      throw new Error("Expected schema parse to fail");
    }

    errorHandler(
      result.error,
      {
        method: "GET",
        originalUrl: "/api/workspaces/unknown/collections",
        params: { workspaceId: "unknown" },
        query: {},
      } as never,
      response as never,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "INVALID_URL_PARAMETERS",
          message:
            "Invalid URL parameters: workspaceId/collectionId must be numeric IDs from `id` (or `_id`) in API responses",
          requestId: "req_test",
        }),
      }),
    );
  });

  it("returns targeted message when params are only in URL", () => {
    const response = makeResponse();
    const schema = z.object({
      collectionId: z.coerce.number().int().positive(),
    });
    const result = schema.safeParse({ collectionId: "1774693508741-f8c1701d" });

    if (result.success) {
      throw new Error("Expected schema parse to fail");
    }

    errorHandler(
      result.error,
      {
        method: "GET",
        originalUrl: "/api/workspaces/1/collections/1774693508741-f8c1701d",
        params: {},
        query: {},
      } as never,
      response as never,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "INVALID_URL_PARAMETERS",
          message:
            "Invalid URL parameters: workspaceId/collectionId must be numeric IDs from `id` (or `_id`) in API responses",
          requestId: "req_test",
        }),
      }),
    );
  });

  it("handles app errors", () => {
    const response = makeResponse();

    errorHandler(
      createAppError(ERROR_CODES.workspaces.WORKSPACE_ACCESS_DENIED),
      {} as never,
      response as never,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "WORKSPACE_ACCESS_DENIED",
        message: "Workspace access denied",
        details: {},
        requestId: "req_test",
      },
    });
  });

  it("handles unknown errors", () => {
    const response = makeResponse();

    errorHandler(new Error("boom"), {} as never, response as never, vi.fn());

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          requestId: "req_test",
        }),
      }),
    );
  });
});
