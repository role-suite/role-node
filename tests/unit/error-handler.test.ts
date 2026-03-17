import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { AppError } from "../../src/shared/errors/app-error.js";
import { errorHandler } from "../../src/shared/errors/error-handler.js";

const makeResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn()
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
        message: "Validation failed"
      })
    );
  });

  it("handles app errors", () => {
    const response = makeResponse();

    errorHandler(new AppError("Forbidden", 403), {} as never, response as never, vi.fn());

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden"
    });
  });

  it("handles unknown errors", () => {
    const response = makeResponse();

    errorHandler(new Error("boom"), {} as never, response as never, vi.fn());

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Internal server error"
      })
    );
  });
});
