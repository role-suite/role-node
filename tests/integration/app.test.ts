import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("App integration", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.headers["x-request-id"]).toBeDefined();
    expect(response.body).toEqual({
      success: true,
      data: { status: "ok" },
    });
  });

  it("registers and logs in a user", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.success).toBe(true);
    expect(registerResponse.body.data.user.email).toBe("altay@example.com");

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "altay@example.com",
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data.tokens.accessToken).toBeTypeOf("string");
  });

  it("returns 404 for removed users endpoint", async () => {
    const listResponse = await request(app).get("/api/users");

    expect(listResponse.status).toBe(404);
    expect(listResponse.body.success).toBe(false);
  });

  it("rejects duplicate auth emails", async () => {
    await request(app).post("/api/auth/register").send({
      name: "First",
      email: "dup@example.com",
      password: "password123",
      accountType: "single",
    });

    const duplicateResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Second",
        email: "dup@example.com",
        password: "password123",
        accountType: "single",
      });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body).toEqual({
      success: false,
      message: "Email already in use",
    });
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request(app).get("/missing");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("returns 400 for invalid register payload", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "A",
      email: "not-an-email",
      password: "123",
      accountType: "single",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("returns 401 for missing token on protected route", async () => {
    const response = await request(app).get("/api/workspaces");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: "Missing access token",
    });
  });
});
