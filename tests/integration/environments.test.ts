import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { setEnvironmentsRepoDbClient } from "../../src/modules/environments/environments.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("environments integration", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setEnvironmentsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setEnvironmentsRepoDbClient(null);
  });

  it("supports environment CRUD for workspace owners", async () => {
    const owner = await request(app).post("/api/auth/register").send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const token = owner.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Env Team" });

    const workspaceId = workspace.body.data.id as number;

    const createResponse = await request(app)
      .post(`/api/workspaces/${workspaceId}/environments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Staging" });

    expect(createResponse.status).toBe(201);
    const environmentId = createResponse.body.data.id as number;

    const listResponse = await request(app)
      .get(`/api/workspaces/${workspaceId}/environments`)
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);

    const updateResponse = await request(app)
      .patch(`/api/workspaces/${workspaceId}/environments/${environmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Production" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.name).toBe("Production");

    const deleteResponse = await request(app)
      .delete(`/api/workspaces/${workspaceId}/environments/${environmentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
  });

  it("supports environment variable CRUD for workspace owners", async () => {
    const owner = await request(app).post("/api/auth/register").send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const token = owner.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Vars Team" });

    const workspaceId = workspace.body.data.id as number;

    const environment = await request(app)
      .post(`/api/workspaces/${workspaceId}/environments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "QA" });
    const environmentId = environment.body.data.id as number;

    const createVar = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ key: "apiUrl", value: "https://api.example.com" });

    expect(createVar.status).toBe(201);
    const variableId = createVar.body.data.id as number;

    const listVar = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(listVar.status).toBe(200);
    expect(listVar.body.data).toHaveLength(1);

    const updateVar = await request(app)
      .patch(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables/${variableId}`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ value: "https://api-v2.example.com", isSecret: true });

    expect(updateVar.status).toBe(200);
    expect(updateVar.body.data.isSecret).toBe(true);

    const deleteVar = await request(app)
      .delete(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables/${variableId}`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(deleteVar.status).toBe(200);
  });

  it("allows members to read but blocks writes", async () => {
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
    const memberToken = member.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Shared Env Team" });
    const workspaceId = workspace.body.data.id as number;

    await request(app)
      .post(`/api/workspaces/${workspaceId}/members`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: "member@example.com", role: "member" });

    const environment = await request(app)
      .post(`/api/workspaces/${workspaceId}/environments`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Member Read" });
    const environmentId = environment.body.data.id as number;

    await request(app)
      .post(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables`,
      )
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ key: "token", value: "abc" });

    const listResponse = await request(app)
      .get(`/api/workspaces/${workspaceId}/environments`)
      .set("Authorization", `Bearer ${memberToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);

    const listVariablesResponse = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables`,
      )
      .set("Authorization", `Bearer ${memberToken}`);

    expect(listVariablesResponse.status).toBe(200);
    expect(listVariablesResponse.body.data).toHaveLength(1);

    const denied = await request(app)
      .post(`/api/workspaces/${workspaceId}/environments`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ name: "Denied" });

    expect(denied.status).toBe(403);
  });
});
