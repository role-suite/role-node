import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import { usersRepo } from "../../src/modules/users/users.repo.js";

describe("HTTP security behavior", () => {
  beforeEach(() => {
    usersRepo.clear();
  });

  it("rejects malformed route params", async () => {
    const response = await request(app).get("/api/users/not-a-number");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("rejects unsupported methods on users route", async () => {
    const response = await request(app).delete("/api/users/1");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("does not expose internal error details for domain errors", async () => {
    await request(app).post("/api/users").send({
      name: "Alpha",
      email: "alpha@example.com",
    });

    const response = await request(app).post("/api/users").send({
      name: "Beta",
      email: "alpha@example.com",
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      success: false,
      message: "Email already in use",
    });
  });
});
