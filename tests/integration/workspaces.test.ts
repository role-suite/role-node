import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import { authRepo, setAuthRepoDbClient } from "../../src/modules/auth/repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("workspaces integration", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
  });

  it("creates and lists workspaces for current user", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });
    const accessToken = registerResponse.body.data.tokens.accessToken;

    const createResponse = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Platform Team" });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.type).toBe("team");
    expect(createResponse.body.data.role).toBe("owner");

    const listResponse = await request(app)
      .get("/api/workspaces")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.items).toHaveLength(2);
  });

  it("returns workspace details for member", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });
    const accessToken = registerResponse.body.data.tokens.accessToken;
    const workspaceId = registerResponse.body.data.workspace.id;

    const response = await request(app)
      .get(`/api/workspaces/${workspaceId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(workspaceId);
  });

  it("denies access for non-member", async () => {
    const first = await request(app).post("/api/auth/register").send({
      name: "First",
      email: "first@example.com",
      password: "password123",
      accountType: "single",
    });
    const second = await request(app).post("/api/auth/register").send({
      name: "Second",
      email: "second@example.com",
      password: "password123",
      accountType: "single",
    });

    const firstToken = first.body.data.tokens.accessToken;
    const secondWorkspaceId = second.body.data.workspace.id;

    const response = await request(app)
      .get(`/api/workspaces/${secondWorkspaceId}`)
      .set("Authorization", `Bearer ${firstToken}`);

    expect(response.status).toBe(403);
  });

  it("manages members for team workspaces", async () => {
    const owner = await request(app).post("/api/auth/register").send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const member = await request(app).post("/api/auth/register").send({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });

    const ownerToken = owner.body.data.tokens.accessToken;
    const memberId = member.body.data.user.id as number;

    const created = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Collab Team" });

    const workspaceId = created.body.data.id as number;

    const addMemberResponse = await request(app)
      .post(`/api/workspaces/${workspaceId}/members`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: "member@example.com", role: "member" });

    expect(addMemberResponse.status).toBe(201);

    const listMembersResponse = await request(app)
      .get(`/api/workspaces/${workspaceId}/members`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(listMembersResponse.status).toBe(200);
    expect(listMembersResponse.body.data.items).toHaveLength(2);

    const updateRoleResponse = await request(app)
      .patch(`/api/workspaces/${workspaceId}/members/${memberId}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ role: "admin" });

    expect(updateRoleResponse.status).toBe(200);
    expect(updateRoleResponse.body.data.role).toBe("admin");

    const removeMemberResponse = await request(app)
      .delete(`/api/workspaces/${workspaceId}/members/${memberId}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(removeMemberResponse.status).toBe(200);
  });

  it("invites and joins workspace via token", async () => {
    const owner = await request(app).post("/api/auth/register").send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const invitee = await request(app).post("/api/auth/register").send({
      name: "Invitee",
      email: "invitee@example.com",
      password: "password123",
      accountType: "single",
    });

    const ownerToken = owner.body.data.tokens.accessToken;
    const inviteeToken = invitee.body.data.tokens.accessToken;

    const created = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Invite Team" });

    const workspaceId = created.body.data.id as number;

    const inviteResponse = await request(app)
      .post(`/api/workspaces/${workspaceId}/invitations`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: "invitee@example.com", role: "member" });

    expect(inviteResponse.status).toBe(201);
    expect(inviteResponse.body.data.token).toBeTruthy();

    const joinResponse = await request(app)
      .post("/api/workspaces/join")
      .set("Authorization", `Bearer ${inviteeToken}`)
      .send({ token: inviteResponse.body.data.token });

    expect(joinResponse.status).toBe(200);
    expect(joinResponse.body.data.id).toBe(workspaceId);
  });

  it("converts personal workspace to team", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Altay",
        email: "altay@example.com",
        password: "password123",
        accountType: "single",
      });

    const accessToken = registerResponse.body.data.tokens.accessToken;
    const workspaceId = registerResponse.body.data.workspace.id;

    const convertResponse = await request(app)
      .post(`/api/workspaces/${workspaceId}/convert-to-team`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Altay Team" });

    expect(convertResponse.status).toBe(200);
    expect(convertResponse.body.data.type).toBe("team");
    expect(convertResponse.body.data.name).toBe("Altay Team");
  });

  it("streams workspace updates by cursor polling", async () => {
    const owner = await request(app).post("/api/auth/register").send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const member = await request(app).post("/api/auth/register").send({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });

    const ownerToken = owner.body.data.tokens.accessToken;
    const memberId = member.body.data.user.id as number;

    const created = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Realtime Team" });

    const workspaceId = created.body.data.id as number;

    await request(app)
      .post(`/api/workspaces/${workspaceId}/members`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: "member@example.com", role: "member" });

    const firstPoll = await request(app)
      .get(`/api/workspaces/${workspaceId}/updates?since=0&limit=50`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(firstPoll.status).toBe(200);
    expect(Array.isArray(firstPoll.body.data.items)).toBe(true);
    expect(firstPoll.body.data.items.length).toBeGreaterThan(0);

    const nextCursor = firstPoll.body.data.cursor.next as number;

    await request(app)
      .patch(`/api/workspaces/${workspaceId}/members/${memberId}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ role: "admin" });

    const secondPoll = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/updates?since=${nextCursor}&limit=50`,
      )
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(secondPoll.status).toBe(200);
    expect(secondPoll.body.data.items.length).toBeGreaterThan(0);
    expect(secondPoll.body.data.items[0].entity).toBe("workspace_member");
  });
});
