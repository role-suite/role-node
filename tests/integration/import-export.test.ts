import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import { authRepo, setAuthRepoDbClient } from "../../src/modules/auth/repo.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/repo.js";
import { setEnvironmentsRepoDbClient } from "../../src/modules/environments/repo.js";
import { setImportExportRepoDbClient } from "../../src/modules/import-export/repo.js";
import { ROUTE_PATTERNS, routeBuilders } from "../../src/shared/routes.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("import/export integration", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    setEnvironmentsRepoDbClient(testDb);
    setImportExportRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
    setEnvironmentsRepoDbClient(null);
    setImportExportRepoDbClient(null);
  });

  it("allows owners to create jobs and retrieve them", async () => {
    const register = await request(app)
      .post(ROUTE_PATTERNS.auth.register)
      .send({
        name: "Owner",
        email: "owner@example.com",
        password: "password123",
        accountType: "single",
      });
    const token = register.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post(ROUTE_PATTERNS.workspaces.create)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Backups Team" });
    const workspaceId = workspace.body.data.id as number;

    const createExport = await request(app)
      .post(routeBuilders.workspaceImportExportExports(workspaceId))
      .set("Authorization", `Bearer ${token}`)
      .send({ format: "json" });

    expect(createExport.status).toBe(201);
    expect(createExport.body.data.type).toBe("export");

    const createImport = await request(app)
      .post(routeBuilders.workspaceImportExportImports(workspaceId))
      .set("Authorization", `Bearer ${token}`)
      .send({
        format: "json",
        payload: {
          version: 1,
          format: "role-native",
          collections: [],
          environments: [],
        },
      });

    expect(createImport.status).toBe(201);
    expect(createImport.body.data.type).toBe("import");
    expect(createImport.body.data.summary.rootKeyCount).toBe(2);

    const listJobs = await request(app)
      .get(routeBuilders.workspaceImportExportJobs(workspaceId))
      .set("Authorization", `Bearer ${token}`);

    expect(listJobs.status).toBe(200);
    expect(listJobs.body.data.items).toHaveLength(2);

    const jobId = createExport.body.data.id as number;
    const getJob = await request(app)
      .get(routeBuilders.workspaceImportExportJobById(workspaceId, jobId))
      .set("Authorization", `Bearer ${token}`);

    expect(getJob.status).toBe(200);
    expect(getJob.body.data.id).toBe(jobId);
  });

  it("allows members to read jobs but blocks creating jobs", async () => {
    const owner = await request(app).post(ROUTE_PATTERNS.auth.register).send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const member = await request(app).post(ROUTE_PATTERNS.auth.register).send({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });

    const ownerToken = owner.body.data.tokens.accessToken;
    const memberToken = member.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post(ROUTE_PATTERNS.workspaces.create)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Shared Team" });
    const workspaceId = workspace.body.data.id as number;

    await request(app)
      .post(routeBuilders.workspaceMembers(workspaceId))
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: "member@example.com", role: "member" });

    const ownerJob = await request(app)
      .post(routeBuilders.workspaceImportExportExports(workspaceId))
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ format: "json" });

    const listAsMember = await request(app)
      .get(routeBuilders.workspaceImportExportJobs(workspaceId))
      .set("Authorization", `Bearer ${memberToken}`);

    expect(listAsMember.status).toBe(200);
    expect(listAsMember.body.data.items).toHaveLength(1);

    const getAsMember = await request(app)
      .get(
        routeBuilders.workspaceImportExportJobById(
          workspaceId,
          ownerJob.body.data.id as number,
        ),
      )
      .set("Authorization", `Bearer ${memberToken}`);

    expect(getAsMember.status).toBe(200);

    const deniedExport = await request(app)
      .post(routeBuilders.workspaceImportExportExports(workspaceId))
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ format: "json" });

    expect(deniedExport.status).toBe(403);
  });

  it("publishes a workspace event when an import job completes", async () => {
    const owner = await request(app).post(ROUTE_PATTERNS.auth.register).send({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const member = await request(app).post(ROUTE_PATTERNS.auth.register).send({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });

    const ownerToken = owner.body.data.tokens.accessToken;
    const memberToken = member.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post(ROUTE_PATTERNS.workspaces.create)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Shared Team" });
    const workspaceId = workspace.body.data.id as number;

    await request(app)
      .post(routeBuilders.workspaceMembers(workspaceId))
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ email: "member@example.com", role: "member" });

    // A teammate polls updates before the import runs, so their next poll starts from a cursor
    // that only includes the import event, not the workspace-creation/membership noise above.
    const beforeImport = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/updates?since=0&limit=50`)
      .set("Authorization", `Bearer ${memberToken}`);
    const cursorBeforeImport = beforeImport.body.data.cursor.next;

    const createImport = await request(app)
      .post(routeBuilders.workspaceImportExportImports(workspaceId))
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        format: "json",
        payload: {
          version: 1,
          format: "role-native",
          collections: [{ name: "Imported Collection" }],
          environments: [{ name: "Imported Environment" }],
        },
      });

    expect(createImport.status).toBe(201);
    const jobId = createImport.body.data.id as number;

    const afterImport = await request(app)
      .get(
        `/api/v1/workspaces/${workspaceId}/updates?since=${cursorBeforeImport}&limit=50`,
      )
      .set("Authorization", `Bearer ${memberToken}`);

    expect(afterImport.status).toBe(200);
    const importEvent = afterImport.body.data.items.find(
      (event: { entity: string }) => event.entity === "import_export_job",
    );

    expect(importEvent).toBeDefined();
    expect(importEvent.action).toBe("completed");
    expect(importEvent.entityId).toBe(jobId);
    expect(importEvent.payload).toEqual({
      importedCollections: 1,
      importedEnvironments: 1,
    });
  });
});
