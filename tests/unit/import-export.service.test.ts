import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { authRepo, setAuthRepoDbClient } from "../../src/modules/auth/repo.js";
import { authService } from "../../src/modules/auth/service.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/repo.js";
import { setEnvironmentsRepoDbClient } from "../../src/modules/environments/repo.js";
import { setImportExportRepoDbClient } from "../../src/modules/import-export/repo.js";
import { importExportService } from "../../src/modules/import-export/service.js";
import { workspacesService } from "../../src/modules/workspaces/service.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("import-export service", () => {
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
    expect(exportJob.artifact.format).toBe("role-native");

    const importJob = await importExportService.createImportJobForWorkspace(
      owner.user.id,
      workspace.id,
      {
        format: "json",
        payload: {
          collections: [],
          environments: [],
          format: "role-native",
          version: 1,
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

  it("imports Röle-native collections and environments", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "native-owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Native Import Team",
    });

    const importJob = await importExportService.createImportJobForWorkspace(
      owner.user.id,
      workspace.id,
      {
        format: "json",
        payload: {
          version: 1,
          format: "role-native",
          collections: [
            {
              name: "Imported API",
              folders: [{ sourceId: 10, name: "Users", position: 0 }],
              endpoints: [
                {
                  name: "List users",
                  method: "GET",
                  url: "https://api.example.com/users",
                  folderSourceId: 10,
                  headers: [{ key: "accept", value: "application/json" }],
                  examples: [{ name: "OK", statusCode: 200 }],
                },
              ],
            },
          ],
          environments: [
            {
              name: "Production",
              variables: [
                {
                  key: "baseUrl",
                  value: "https://api.example.com",
                  enabled: true,
                },
              ],
            },
          ],
        },
      },
    );

    expect(importJob.summary.importedCollections).toBe(1);
    expect(importJob.summary.importedEnvironments).toBe(1);

    const exportJob = await importExportService.createExportJobForWorkspace(
      owner.user.id,
      workspace.id,
      { format: "json" },
    );

    expect(exportJob.summary.collectionCount).toBe(1);
    expect(exportJob.summary.environmentCount).toBe(1);
    expect(exportJob.artifact.collections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Imported API",
          endpoints: expect.arrayContaining([
            expect.objectContaining({ name: "List users" }),
          ]),
        }),
      ]),
    );
    expect(exportJob.artifact.environments).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Production" })]),
    );
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
          payload: { version: 1, format: "role-native", collections: [] },
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
