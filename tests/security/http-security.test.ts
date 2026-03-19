import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/collections.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("HTTP security behavior", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
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

  it("rejects malformed collection endpoint payload", async () => {
    const register = await request(app).post("/api/auth/register").send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const token = register.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Security Team" });

    const workspaceId = workspace.body.data.id as number;

    const collection = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Orders" });

    const collectionId = collection.body.data.id as number;

    const response = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "A",
        method: "INVALID",
        url: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("rejects malformed collection route params", async () => {
    const register = await request(app).post("/api/auth/register").send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const token = register.body.data.tokens.accessToken;

    const response = await request(app)
      .get("/api/workspaces/not-a-number/collections")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });
});
