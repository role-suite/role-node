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

describe("workspace environments e2e flow", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setEnvironmentsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setEnvironmentsRepoDbClient(null);
  });

  it("runs end-to-end collaboration with environments and variables", async () => {
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
      .send({ name: "API Team" });
    expect(workspace.status).toBe(201);
    const workspaceId = workspace.body.data.id as number;

    const addMember = await request(app)
      .post(`/api/workspaces/${workspaceId}/members`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: "member@example.com", role: "member" });
    expect(addMember.status).toBe(201);

    const environment = await request(app)
      .post(`/api/workspaces/${workspaceId}/environments`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Staging" });
    expect(environment.status).toBe(201);
    const environmentId = environment.body.data.id as number;

    const variable = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables`,
      )
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ key: "apiUrl", value: "https://staging.example.com" });
    expect(variable.status).toBe(201);
    const variableId = variable.body.data.id as number;

    const memberReadsVariable = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables/${variableId}`,
      )
      .set("Authorization", `Bearer ${memberToken}`);
    expect(memberReadsVariable.status).toBe(200);

    const memberWritesVariable = await request(app)
      .patch(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables/${variableId}`,
      )
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ value: "https://blocked.example.com" });
    expect(memberWritesVariable.status).toBe(403);

    const ownerUpdatesVariable = await request(app)
      .patch(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables/${variableId}`,
      )
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ value: "https://prod.example.com", isSecret: true });
    expect(ownerUpdatesVariable.status).toBe(200);

    const ownerDeletesVariable = await request(app)
      .delete(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables/${variableId}`,
      )
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(ownerDeletesVariable.status).toBe(200);
  });
});
