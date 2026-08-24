import { describe, expect, it } from "vitest";

import { DbError } from "../../src/shared/errors/db-error.js";

describe("DbError", () => {
  it("uses defaults", () => {
    const error = new DbError("db failed");

    expect(error.name).toBe("DbError");
    expect(error.message).toBe("db failed");
    expect(error.statusCode).toBe(500);
  });

  it("stores cause and status code", () => {
    const cause = new Error("driver failure");
    const error = new DbError("query failed", {
      cause,
      statusCode: 503,
    });

    expect(error.statusCode).toBe(503);
    expect(error.cause).toBe(cause);
  });
});
