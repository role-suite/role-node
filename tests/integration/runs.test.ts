import request from "supertest";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { app } from "../../src/app.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/collections.repo.js";
import { setEnvironmentsRepoDbClient } from "../../src/modules/environments/environments.repo.js";
import { setRunsRepoDbClient } from "../../src/modules/runs/runs.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("runs integration", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    setEnvironmentsRepoDbClient(testDb);
    setRunsRepoDbClient(testDb);
    await authRepo.clear();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
    setEnvironmentsRepoDbClient(null);
    setRunsRepoDbClient(null);
  });

  it("creates and retrieves an ad-hoc run", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{"ok":true}', {
        status: 200,
        headers: {
          "content-type": "application/json",
          "set-cookie": "session=secret",
        },
      }),
    );

    const register = await request(app).post("/api/auth/register").send({
      name: "Runner",
      email: "runner@example.com",
      password: "password123",
      accountType: "single",
    });
    const token = register.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Runner Team" });
    const workspaceId = workspace.body.data.id as number;

    const createRun = await request(app)
      .post(`/api/workspaces/${workspaceId}/runs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        source: {
          type: "adhoc",
          request: {
            method: "GET",
            url: "https://api.example.com/orders?token=raw",
            headers: [{ key: "Authorization", value: "Bearer abc" }],
            queryParams: [{ key: "password", value: "secret" }],
            auth: { type: "none" },
          },
        },
      });

    expect(createRun.status).toBe(201);
    expect(createRun.body.data.status).toBe("completed");
    expect(createRun.body.data.response.status).toBe(200);
    expect(createRun.body.data.request.headers[0].value).toBe("***");
    expect(createRun.body.data.request.queryParams[0].value).toBe("***");

    const runId = createRun.body.data.runId as number;

    const getRun = await request(app)
      .get(`/api/workspaces/${workspaceId}/runs/${runId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRun.status).toBe(200);
    expect(getRun.body.data.runId).toBe(runId);
    expect(getRun.body.data.response.headers["set-cookie"]).toBe("***");
  });

  it("executes collection endpoint source with environment resolution", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{"ok":true}', {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }),
    );

    const register = await request(app).post("/api/auth/register").send({
      name: "Runner",
      email: "runner@example.com",
      password: "password123",
      accountType: "single",
    });
    const token = register.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Runner Team" });
    const workspaceId = workspace.body.data.id as number;

    const collection = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Orders API" });
    const collectionId = collection.body.data.id as number;

    const endpoint = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Get Orders",
        method: "GET",
        url: "https://{{host}}/orders?region={{region}}",
        auth: {
          type: "bearer",
          token: "{{apiToken}}",
        },
      });
    const endpointId = endpoint.body.data.id as number;

    const environment = await request(app)
      .post(`/api/workspaces/${workspaceId}/environments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Dev" });
    const environmentId = environment.body.data.id as number;

    await request(app)
      .post(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ key: "host", value: "api.example.com" });
    await request(app)
      .post(
        `/api/workspaces/${workspaceId}/environments/${environmentId}/variables`,
      )
      .set("Authorization", `Bearer ${token}`)
      .send({ key: "apiToken", value: "secret-token", isSecret: true });

    const createRun = await request(app)
      .post(`/api/workspaces/${workspaceId}/runs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        source: {
          type: "collectionEndpoint",
          collectionId,
          endpointId,
        },
        environmentId,
        variableOverrides: [{ key: "region", value: "eu-west-1" }],
      });

    expect(createRun.status).toBe(201);
    expect(createRun.body.data.request.resolvedVariables.host).toBe(
      "api.example.com",
    );
    expect(createRun.body.data.request.resolvedVariables.apiToken).toBe("***");

    const [calledUrl, calledInit] = fetchSpy.mock.calls[0] ?? [];
    expect(calledUrl).toBe("https://api.example.com/orders?region=eu-west-1");
    expect(calledInit).toMatchObject({
      method: "GET",
    });
  });

  it("blocks disallowed network targets", async () => {
    const register = await request(app).post("/api/auth/register").send({
      name: "Runner",
      email: "runner@example.com",
      password: "password123",
      accountType: "single",
    });
    const token = register.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Runner Team" });
    const workspaceId = workspace.body.data.id as number;

    const createRun = await request(app)
      .post(`/api/workspaces/${workspaceId}/runs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        source: {
          type: "adhoc",
          request: {
            method: "GET",
            url: "http://127.0.0.1:8080/private",
            headers: [],
            queryParams: [],
            body: null,
            auth: { type: "none" },
          },
        },
      });

    expect(createRun.status).toBe(422);
    expect(createRun.body.success).toBe(false);
  });
});
