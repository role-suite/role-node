import { describe, expect, it, vi } from "vitest";

import { notFoundHandler } from "../../src/shared/middleware/not-found.js";

describe("not found middleware", () => {
  it("returns route-not-found payload", () => {
    const response = {
      status: vi.fn(),
      json: vi.fn()
    };
    response.status.mockReturnValue(response);

    notFoundHandler(
      {
        method: "GET",
        originalUrl: "/unknown"
      } as never,
      response as never
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Route not found: GET /unknown"
    });
  });
});
