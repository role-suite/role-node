import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("HTTP security behavior", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
  });

  it("rejects malformed auth payload", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "not-an-email",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("rejects unsupported methods on auth route", async () => {
    const response = await request(app).delete("/api/auth/login");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("does not expose internal error details for domain errors", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Alpha",
      email: "alpha@example.com",
      password: "password123",
      accountType: "single",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Beta",
      email: "alpha@example.com",
      password: "password123",
      accountType: "single",
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      success: false,
      message: "Email already in use",
    });
  });
});
