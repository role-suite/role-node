import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { authService } from "../../src/modules/auth/auth.service.js";
import { setImportExportRepoDbClient } from "../../src/modules/import-export/import-export.repo.js";
import { importExportService } from "../../src/modules/import-export/import-export.service.js";
import { workspacesService } from "../../src/modules/workspaces/workspaces.service.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("import-export service", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setImportExportRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setImportExportRepoDbClient(null);
  });

  it("allows owners to create export and import jobs", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Import Export Team",
    });

    const exportJob = await importExportService.createExportJobForWorkspace(
      owner.user.id,
      workspace.id,
      {
        format: "json",
        includeCollections: true,
        includeEnvironments: true,
      },
    );

    expect(exportJob.type).toBe("export");

    const importJob = await importExportService.createImportJobForWorkspace(
      owner.user.id,
      workspace.id,
      {
        format: "json",
        payload: {
          collections: [],
          environments: [],
        },
      },
    );

    expect(importJob.type).toBe("import");

    const jobs = await importExportService.listJobsForWorkspace(
      owner.user.id,
      workspace.id,
    );
    expect(jobs).toHaveLength(2);
  });

  it("blocks members from creating jobs but allows read", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const member = await authService.register({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Permissions Team",
    });

    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: member.user.email,
      role: "member",
    });

    const ownerJob = await importExportService.createExportJobForWorkspace(
      owner.user.id,
      workspace.id,
      { format: "json" },
    );

    await expect(
      importExportService.createImportJobForWorkspace(
        member.user.id,
        workspace.id,
        {
          format: "json",
          payload: { collections: [] },
        },
      ),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Only workspace owners and admins can run imports and exports",
    });

    const read = await importExportService.getJobByIdForWorkspace(
      member.user.id,
      workspace.id,
      ownerJob.id,
    );

    expect(read.id).toBe(ownerJob.id);
  });
});
