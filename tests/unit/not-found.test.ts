import { describe, expect, it, vi } from "vitest";

import { notFoundHandler } from "../../src/shared/middleware/not-found.js";

describe("not found middleware", () => {
  it("returns route-not-found payload", () => {
    const response = {
      locals: {
        requestId: "req_test",
      },
      status: vi.fn(),
      json: vi.fn(),
    };
    response.status.mockReturnValue(response);

    notFoundHandler(
      {
        method: "GET",
        originalUrl: "/unknown",
      } as never,
      response as never,
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "Route not found",
        details: {
          method: "GET",
          path: "/unknown",
        },
        requestId: "req_test",
      },
    });
  });
});
