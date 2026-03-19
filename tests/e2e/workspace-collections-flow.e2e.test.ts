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

describe("workspace collections e2e flow", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
  });

  it("runs end-to-end workspace collaboration with collection endpoints", async () => {
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

    const collection = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Orders API", description: "Orders endpoints" });
    expect(collection.status).toBe(201);
    const collectionId = collection.body.data.id as number;

    const endpoint = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "Get Orders",
        method: "GET",
        url: "https://api.example.com/orders",
        queryParams: [{ key: "limit", value: "20" }],
      });
    expect(endpoint.status).toBe(201);
    const endpointId = endpoint.body.data.id as number;

    const memberReadsEndpoint = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}`,
      )
      .set("Authorization", `Bearer ${memberToken}`);
    expect(memberReadsEndpoint.status).toBe(200);

    const memberWritesEndpoint = await request(app)
      .patch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}`,
      )
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ method: "POST" });
    expect(memberWritesEndpoint.status).toBe(403);

    const ownerUpdatesEndpoint = await request(app)
      .patch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}`,
      )
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ method: "POST", body: { raw: "{}" } });
    expect(ownerUpdatesEndpoint.status).toBe(200);

    const ownerDeletesEndpoint = await request(app)
      .delete(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}`,
      )
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(ownerDeletesEndpoint.status).toBe(200);
  });
});
