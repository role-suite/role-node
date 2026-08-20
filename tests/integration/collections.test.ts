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

describe("collections integration", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
  });

  it("supports collection CRUD for workspace owners", async () => {
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
      .send({ name: "Collections Team" });

    const workspaceId = workspace.body.data.id as number;

    const createResponse = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Orders", description: "Orders endpoints" });

    expect(createResponse.status).toBe(201);
    const collectionId = createResponse.body.data.id as number;

    const listResponse = await request(app)
      .get(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.items).toHaveLength(1);

    const updateResponse = await request(app)
      .patch(`/api/workspaces/${workspaceId}/collections/${collectionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Orders v2" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.name).toBe("Orders v2");

    const deleteResponse = await request(app)
      .delete(`/api/workspaces/${workspaceId}/collections/${collectionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
  });

  it("allows members to read but blocks write operations", async () => {
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
      .send({ name: "Shared Team" });

    const workspaceId = workspace.body.data.id as number;

    await request(app)
      .post(`/api/workspaces/${workspaceId}/members`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: "member@example.com", role: "member" });

    await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Payments" });

    const listResponse = await request(app)
      .get(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${memberToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.items).toHaveLength(1);

    const createDenied = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ name: "Denied" });

    expect(createDenied.status).toBe(403);
  });

  it("supports endpoint CRUD inside a collection", async () => {
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
      .send({ name: "Endpoints Team" });
    const workspaceId = workspace.body.data.id as number;

    const collection = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Orders API" });
    const collectionId = collection.body.data.id as number;

    const createEndpoint = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Get Orders",
        method: "GET",
        url: "https://api.example.com/orders",
        queryParams: [{ key: "limit", value: "10" }],
      });

    expect(createEndpoint.status).toBe(201);
    const endpointId = createEndpoint.body.data.id as number;

    const listEndpoints = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(listEndpoints.status).toBe(200);
    expect(listEndpoints.body.data.items).toHaveLength(1);

    const updateEndpoint = await request(app)
      .patch(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ method: "POST", body: { raw: "{}" } });

    expect(updateEndpoint.status).toBe(200);
    expect(updateEndpoint.body.data.method).toBe("POST");

    const getEndpoint = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(getEndpoint.status).toBe(200);
    expect(getEndpoint.body.data.id).toBe(endpointId);

    const deleteEndpoint = await request(app)
      .delete(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(deleteEndpoint.status).toBe(200);
  });

  it("allows members to read endpoints but blocks endpoint writes", async () => {
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
      .send({ name: "Shared Endpoints Team" });
    const workspaceId = workspace.body.data.id as number;

    await request(app)
      .post(`/api/workspaces/${workspaceId}/members`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: "member@example.com", role: "member" });

    const collection = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Catalog API" });
    const collectionId = collection.body.data.id as number;

    const endpoint = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "List Catalog",
        method: "GET",
        url: "https://api.example.com/catalog",
      });
    const endpointId = endpoint.body.data.id as number;

    const readResponse = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}`,
      )
      .set("Authorization", `Bearer ${memberToken}`);

    expect(readResponse.status).toBe(200);

    const createDenied = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        name: "Denied",
        method: "POST",
        url: "https://api.example.com/catalog",
      });

    expect(createDenied.status).toBe(403);
  });

  it("supports folder and saved example single-resource reads", async () => {
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
      .send({ name: "Read Details Team" });
    const workspaceId = workspace.body.data.id as number;

    const collection = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Details API" });
    const collectionId = collection.body.data.id as number;

    const folder = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/folders`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Orders" });
    const folderId = folder.body.data.id as number;

    const readFolder = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/folders/${folderId}`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(readFolder.status).toBe(200);
    expect(readFolder.body.data.id).toBe(folderId);

    const endpoint = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Get Orders",
        method: "GET",
        url: "https://api.example.com/orders",
        folderId,
      });
    const endpointId = endpoint.body.data.id as number;

    const example = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}/examples`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "200 OK", statusCode: 200, body: "[]" });
    const exampleId = example.body.data.id as number;

    const readExample = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints/${endpointId}/examples/${exampleId}`,
      )
      .set("Authorization", `Bearer ${token}`);

    expect(readExample.status).toBe(200);
    expect(readExample.body.data.id).toBe(exampleId);
  });
});
