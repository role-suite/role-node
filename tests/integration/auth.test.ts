import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import { authRepo, setAuthRepoDbClient } from "../../src/modules/auth/repo.js";
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
    const response = await request(app).post("/api/v1/auth/register").send({
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

  it("treats email as case-insensitive across register, duplicate check, and login", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "Altay@Example.COM",
        password: "password123",
        accountType: "single",
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.data.user.email).toBe("altay@example.com");

    const duplicateResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    expect(duplicateResponse.status).toBe(409);

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "ALTAY@EXAMPLE.COM",
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.user.email).toBe("altay@example.com");
  });

  it("returns current authenticated profile with /me", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const accessToken = registerResponse.body.data.tokens.accessToken;
    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.data.user.email).toBe("altay@example.com");
  });

  it("returns all memberships on /me when user belongs to multiple workspaces", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
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
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.data.memberships).toHaveLength(2);
  });

  it("rotates refresh tokens and invalidates old token after logout", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const firstRefreshToken = registerResponse.body.data.tokens.refreshToken;

    const refreshResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .send({
        refreshToken: firstRefreshToken,
      });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.data.tokens.refreshToken).not.toBe(
      firstRefreshToken,
    );

    const secondRefreshToken = refreshResponse.body.data.tokens.refreshToken;

    const logoutResponse = await request(app).post("/api/v1/auth/logout").send({
      refreshToken: secondRefreshToken,
    });

    expect(logoutResponse.status).toBe(200);

    const refreshAfterLogoutResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: secondRefreshToken });

    expect(refreshAfterLogoutResponse.status).toBe(401);
  });

  it("switches to another workspace the user is a member of", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const userId = registerResponse.body.data.user.id as number;
    const firstWorkspaceId = registerResponse.body.data.workspace.id as number;
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
    const switchResponse = await request(app)
      .post("/api/v1/auth/switch-workspace")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ workspaceId: secondWorkspace.id });

    expect(switchResponse.status).toBe(200);
    expect(switchResponse.body.data.workspace.id).toBe(secondWorkspace.id);
    expect(switchResponse.body.data.workspace.role).toBe("member");
    expect(switchResponse.body.data.tokens.accessToken).toBeTypeOf("string");

    const newAccessToken = switchResponse.body.data.tokens.accessToken;
    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${newAccessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.data.workspace.id).toBe(secondWorkspace.id);
    expect(meResponse.body.data.workspace.id).not.toBe(firstWorkspaceId);
  });

  it("rejects switching to a workspace the user is not a member of", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const otherUserRegisterResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Someone Else",
        email: "someone@example.com",
        password: "password123",
        accountType: "single",
      });

    const foreignWorkspaceId = otherUserRegisterResponse.body.data.workspace
      .id as number;
    const accessToken = registerResponse.body.data.tokens.accessToken;

    const switchResponse = await request(app)
      .post("/api/v1/auth/switch-workspace")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ workspaceId: foreignWorkspaceId });

    expect(switchResponse.status).toBe(403);
    expect(switchResponse.body.error.code).toBe("WORKSPACE_ACCESS_DENIED");
  });

  it("revokes the prior session's refresh token when switching workspace", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
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
    const firstRefreshToken = registerResponse.body.data.tokens.refreshToken;

    const switchResponse = await request(app)
      .post("/api/v1/auth/switch-workspace")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ workspaceId: secondWorkspace.id });

    expect(switchResponse.status).toBe(200);

    const refreshWithOldTokenResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: firstRefreshToken });

    expect(refreshWithOldTokenResponse.status).toBe(401);
  });

  it("requires authentication to switch workspace", async () => {
    const switchResponse = await request(app)
      .post("/api/v1/auth/switch-workspace")
      .send({ workspaceId: 1 });

    expect(switchResponse.status).toBe(401);
  });

  it("lists active sessions and flags the current one", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const refreshToken = registerResponse.body.data.tokens.refreshToken;

    const refreshResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken });

    const secondAccessToken = refreshResponse.body.data.tokens.accessToken;

    const sessionsResponse = await request(app)
      .get("/api/v1/auth/sessions")
      .set("Authorization", `Bearer ${secondAccessToken}`);

    expect(sessionsResponse.status).toBe(200);
    expect(sessionsResponse.body.data.items).toHaveLength(1);
    expect(sessionsResponse.body.data.items[0].current).toBe(true);
    expect(sessionsResponse.body.data.items[0].workspaceName).toBe(
      registerResponse.body.data.workspace.name,
    );
    expect(sessionsResponse.body.data.items[0]).not.toHaveProperty(
      "refreshTokenHash",
    );
  });

  it("revokes a specific session by id", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const accessToken = registerResponse.body.data.tokens.accessToken;

    const secondLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "altay@example.com", password: "password123" });

    const sessionsResponse = await request(app)
      .get("/api/v1/auth/sessions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(sessionsResponse.body.data.items).toHaveLength(2);

    const otherSession = sessionsResponse.body.data.items.find(
      (session: { current: boolean }) => !session.current,
    );

    const revokeResponse = await request(app)
      .delete(`/api/v1/auth/sessions/${otherSession.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(revokeResponse.status).toBe(200);
    expect(revokeResponse.body.data.action).toBe("revoked");

    const refreshWithRevokedSessionResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .send({
        refreshToken: secondLoginResponse.body.data.tokens.refreshToken,
      });

    expect(refreshWithRevokedSessionResponse.status).toBe(401);
  });

  it("rejects revoking a session belonging to another user", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const otherRegisterResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Someone Else",
        email: "someone@example.com",
        password: "password123",
        accountType: "single",
      });

    const accessToken = registerResponse.body.data.tokens.accessToken;

    const sessionsResponse = await request(app)
      .get("/api/v1/auth/sessions")
      .set(
        "Authorization",
        `Bearer ${otherRegisterResponse.body.data.tokens.accessToken}`,
      );

    const otherUserSessionId = sessionsResponse.body.data.items[0].id;

    const revokeResponse = await request(app)
      .delete(`/api/v1/auth/sessions/${otherUserSessionId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(revokeResponse.status).toBe(404);
    expect(revokeResponse.body.error.code).toBe("AUTH_SESSION_NOT_FOUND");
  });

  it("revokes all sessions except the current one", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const accessToken = registerResponse.body.data.tokens.accessToken;

    await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "altay@example.com", password: "password123" });
    await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "altay@example.com", password: "password123" });

    const beforeSessionsResponse = await request(app)
      .get("/api/v1/auth/sessions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(beforeSessionsResponse.body.data.items).toHaveLength(3);

    const revokeOthersResponse = await request(app)
      .delete("/api/v1/auth/sessions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(revokeOthersResponse.status).toBe(200);
    expect(revokeOthersResponse.body.data.action).toBe("revoked");
    expect(revokeOthersResponse.body.data.count).toBe(2);

    const afterSessionsResponse = await request(app)
      .get("/api/v1/auth/sessions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(afterSessionsResponse.body.data.items).toHaveLength(1);
    expect(afterSessionsResponse.body.data.items[0].current).toBe(true);
  });

  it("requires authentication to list or revoke sessions", async () => {
    const listResponse = await request(app).get("/api/v1/auth/sessions");
    expect(listResponse.status).toBe(401);

    const revokeResponse = await request(app).delete("/api/v1/auth/sessions/1");
    expect(revokeResponse.status).toBe(401);

    const revokeOthersResponse = await request(app).delete(
      "/api/v1/auth/sessions",
    );
    expect(revokeOthersResponse.status).toBe(401);
  });
});
