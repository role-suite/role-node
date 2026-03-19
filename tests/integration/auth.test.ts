import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("auth integration", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
  });

  it("registers single user and returns auth payload", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Altay",
      email: "altay@example.com",
      password: "password123",
      accountType: "single",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.workspace.type).toBe("personal");
    expect(response.body.data.tokens.accessToken).toBeTypeOf("string");
  });

  it("returns current authenticated profile with /me", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const accessToken = registerResponse.body.data.tokens.accessToken;
    const meResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.data.user.email).toBe("altay@example.com");
  });

  it("returns all memberships on /me when user belongs to multiple workspaces", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const userId = registerResponse.body.data.user.id as number;
    const secondWorkspace = await authRepo.createWorkspace({
      name: "Support Team",
      type: "team",
      createdByUserId: userId,
    });
    await authRepo.createMembership({
      userId,
      workspaceId: secondWorkspace.id,
      role: "member",
    });

    const accessToken = registerResponse.body.data.tokens.accessToken;
    const meResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.data.memberships).toHaveLength(2);
  });

  it("rotates refresh tokens and invalidates old token after logout", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const firstRefreshToken = registerResponse.body.data.tokens.refreshToken;

    const refreshResponse = await request(app).post("/api/auth/refresh").send({
      refreshToken: firstRefreshToken,
    });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.data.tokens.refreshToken).not.toBe(
      firstRefreshToken,
    );

    const secondRefreshToken = refreshResponse.body.data.tokens.refreshToken;

    const logoutResponse = await request(app).post("/api/auth/logout").send({
      refreshToken: secondRefreshToken,
    });

    expect(logoutResponse.status).toBe(200);

    const refreshAfterLogoutResponse = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: secondRefreshToken });

    expect(refreshAfterLogoutResponse.status).toBe(401);
  });
});
