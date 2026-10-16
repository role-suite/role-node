import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import { authRepo, setAuthRepoDbClient } from "../../src/modules/auth/repo.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("collection versions integration", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
  });

  it("exposes version history, manual versions and restore over REST", async () => {
    const owner = await request(app).post("/api/v1/auth/register").send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const token = owner.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/v1/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Versions Team" });
    const workspaceId = workspace.body.data.id as number;

    const collection = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Orders" });
    const collectionId = collection.body.data.id as number;

    await request(app)
      .post(
        `/api/v1/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Get Orders",
        method: "GET",
        url: "https://api.example.com/orders",
      });

    const listResponse = await request(app)
      .get(
        `/api/v1/workspaces/${workspaceId}/collections/${collectionId}/versions`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.items).toHaveLength(2);
    expect(listResponse.body.data.cursor).toMatchObject({ hasMore: false });

    const createVersionResponse = await request(app)
      .post(
        `/api/v1/workspaces/${workspaceId}/collections/${collectionId}/versions`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ label: "before-refactor" });

    expect(createVersionResponse.status).toBe(201);
    expect(createVersionResponse.body.data).toMatchObject({
      label: "before-refactor",
      source: "manual",
    });

    const versionId = createVersionResponse.body.data.id as number;

    const getVersionResponse = await request(app)
      .get(
        `/api/v1/workspaces/${workspaceId}/collections/${collectionId}/versions/${versionId}`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(getVersionResponse.status).toBe(200);
    expect(getVersionResponse.body.data.snapshot.endpoints).toHaveLength(1);
    expect(getVersionResponse.body.data.snapshot.endpoints[0].name).toBe(
      "Get Orders",
    );

    await request(app)
      .post(
        `/api/v1/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Create Order",
        method: "POST",
        url: "https://api.example.com/orders",
      });

    const restoreResponse = await request(app)
      .post(
        `/api/v1/workspaces/${workspaceId}/collections/${collectionId}/versions/${versionId}/restore`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(restoreResponse.status).toBe(200);
    expect(restoreResponse.body.data.restoredFromVersionId).toBe(versionId);
    expect(restoreResponse.body.data.version).toMatchObject({
      source: "restore",
    });
    expect(restoreResponse.body.data.collection.id).toBe(collectionId);

    const endpointsAfterRestore = await request(app)
      .get(
        `/api/v1/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(endpointsAfterRestore.body.data.items).toHaveLength(1);
    expect(endpointsAfterRestore.body.data.items[0].name).toBe("Get Orders");
  });

  it("returns 404 for an unknown collection version", async () => {
    const owner = await request(app).post("/api/v1/auth/register").send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const token = owner.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/v1/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Missing Team" });
    const workspaceId = workspace.body.data.id as number;

    const collection = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Orders" });
    const collectionId = collection.body.data.id as number;

    const response = await request(app)
      .get(
        `/api/v1/workspaces/${workspaceId}/collections/${collectionId}/versions/9999`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("COLLECTION_VERSION_NOT_FOUND");

    const missingRestore = await request(app)
      .post(
        `/api/v1/workspaces/${workspaceId}/collections/${collectionId}/versions/9999/restore`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(missingRestore.status).toBe(404);
    expect(missingRestore.body.error.code).toBe("COLLECTION_VERSION_NOT_FOUND");
  });
});
