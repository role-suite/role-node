import { describe, expect, it } from "vitest";

import { AppError } from "../../src/shared/errors/app-error.js";

describe("AppError", () => {
  it("sets default status code", () => {
    const error = new AppError("Something failed");

    expect(error.name).toBe("AppError");
    expect(error.message).toBe("Something failed");
    expect(error.statusCode).toBe(500);
  });

  it("uses provided status code", () => {
    const error = new AppError("Not found", 404);
    expect(error.statusCode).toBe(404);
  });
});
