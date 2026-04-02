import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { setImportExportRepoDbClient } from "../../src/modules/import-export/import-export.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("import/export integration", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setImportExportRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setImportExportRepoDbClient(null);
  });

  it("allows owners to create jobs and retrieve them", async () => {
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
      .send({ name: "Backups Team" });
    const workspaceId = workspace.body.data.id as number;

    const createExport = await request(app)
      .post(`/api/workspaces/${workspaceId}/import-export/exports`)
      .set("Authorization", `Bearer ${token}`)
      .send({ format: "json", includeRuns: true });

    expect(createExport.status).toBe(201);
    expect(createExport.body.data.type).toBe("export");
    expect(createExport.body.data.summary.includeRuns).toBe(true);

    const createImport = await request(app)
      .post(`/api/workspaces/${workspaceId}/import-export/imports`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        format: "json",
        payload: {
          collections: [],
          environments: [],
        },
      });

    expect(createImport.status).toBe(201);
    expect(createImport.body.data.type).toBe("import");
    expect(createImport.body.data.summary.rootKeyCount).toBe(2);

    const listJobs = await request(app)
      .get(`/api/workspaces/${workspaceId}/import-export/jobs`)
      .set("Authorization", `Bearer ${token}`);

    expect(listJobs.status).toBe(200);
    expect(listJobs.body.data).toHaveLength(2);

    const jobId = createExport.body.data.id as number;
    const getJob = await request(app)
      .get(`/api/workspaces/${workspaceId}/import-export/jobs/${jobId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getJob.status).toBe(200);
    expect(getJob.body.data.id).toBe(jobId);
  });

  it("allows members to read jobs but blocks creating jobs", async () => {
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

    const ownerJob = await request(app)
      .post(`/api/workspaces/${workspaceId}/import-export/exports`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ format: "json" });

    const listAsMember = await request(app)
      .get(`/api/workspaces/${workspaceId}/import-export/jobs`)
      .set("Authorization", `Bearer ${memberToken}`);

    expect(listAsMember.status).toBe(200);
    expect(listAsMember.body.data).toHaveLength(1);

    const getAsMember = await request(app)
      .get(
        `/api/workspaces/${workspaceId}/import-export/jobs/${ownerJob.body.data.id as number}`,
      )
      .set("Authorization", `Bearer ${memberToken}`);

    expect(getAsMember.status).toBe(200);

    const deniedExport = await request(app)
      .post(`/api/workspaces/${workspaceId}/import-export/exports`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ format: "json" });

    expect(deniedExport.status).toBe(403);
  });
});
