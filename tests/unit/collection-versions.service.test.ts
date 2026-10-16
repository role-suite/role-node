import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { authRepo, setAuthRepoDbClient } from "../../src/modules/auth/repo.js";
import { authService } from "../../src/modules/auth/service.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/repo.js";
import { collectionsService } from "../../src/modules/collections/service.js";
import { collectionVersionsService } from "../../src/modules/collections/versions.service.js";
import { workspaceEventsService } from "../../src/modules/workspaces/events.service.js";
import { workspacesService } from "../../src/modules/workspaces/service.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

const registerOwner = async (email = "owner@example.com") => {
  return authService.register({
    name: "Owner",
    email,
    password: "password123",
    accountType: "single",
  });
};

describe("collection versions service", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
  });

  it("records an automatic version when a collection is created and mutated", async () => {
    const owner = await registerOwner();
    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Versions Team",
    });

    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Orders" },
    );

    const initial = await collectionVersionsService.listForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { limit: 100 },
    );

    expect(initial.items).toHaveLength(1);
    expect(initial.items[0]).toMatchObject({
      collectionId: collection.id,
      versionNumber: 1,
      label: null,
      source: "auto",
    });

    await collectionsService.createEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { name: "Get Orders", method: "GET", url: "https://api.example.com" },
    );

    const afterMutation = await collectionVersionsService.listForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { limit: 100 },
    );

    expect(afterMutation.items).toHaveLength(2);
    expect(afterMutation.items[0]?.versionNumber).toBe(2);

    const detail = await collectionVersionsService.getForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      afterMutation.items[0]!.id,
    );

    expect(detail.snapshot.endpoints).toHaveLength(1);
    expect(detail.snapshot.endpoints[0]?.name).toBe("Get Orders");
  });

  it("creates labeled manual versions and paginates the history", async () => {
    const owner = await registerOwner();
    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Paging Team",
    });
    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Catalog" },
    );

    for (const name of ["One", "Two", "Three", "Four"]) {
      await collectionsService.createEndpointForCollection(
        owner.user.id,
        workspace.id,
        collection.id,
        { name, method: "GET", url: `https://api.example.com/${name}` },
      );
    }

    const manual = await collectionVersionsService.createForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { label: "checkpoint" },
    );

    expect(manual).toMatchObject({ label: "checkpoint", source: "manual" });

    const firstPage = await collectionVersionsService.listForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { limit: 2 },
    );

    expect(firstPage.items).toHaveLength(2);
    expect(firstPage.cursor.hasMore).toBe(true);

    const secondPage = await collectionVersionsService.listForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { limit: 2, cursor: firstPage.cursor.next },
    );

    expect(secondPage.items).toHaveLength(2);
    expect(secondPage.cursor.hasMore).toBe(true);

    const thirdPage = await collectionVersionsService.listForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { limit: 2, cursor: secondPage.cursor.next },
    );

    expect(thirdPage.items).toHaveLength(2);
    expect(thirdPage.cursor.hasMore).toBe(false);

    const allIds = [
      ...firstPage.items,
      ...secondPage.items,
      ...thirdPage.items,
    ].map((item) => item.id);

    expect(new Set(allIds).size).toBe(6);
    expect(allIds).toContain(manual.id);
  });

  it("restores a previous version and records the pre-restore state", async () => {
    const owner = await registerOwner();
    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Restore Team",
    });
    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Orders" },
    );

    const rootFolder = await collectionsService.createFolderForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { name: "Root" },
    );
    await collectionsService.createFolderForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { name: "Child", parentFolderId: rootFolder.id },
    );

    const firstEndpoint = await collectionsService.createEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { name: "First", method: "GET", url: "https://api.example.com/first" },
    );

    const versionsAfterFirst =
      await collectionVersionsService.listForCollection(
        owner.user.id,
        workspace.id,
        collection.id,
        { limit: 1 },
      );
    const targetVersionId = versionsAfterFirst.items[0]!.id;

    await collectionsService.updateForWorkspace(
      owner.user.id,
      workspace.id,
      collection.id,
      { name: "Orders v2" },
    );
    await collectionsService.createEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { name: "Second", method: "POST", url: "https://api.example.com/second" },
    );

    const result = await collectionVersionsService.restoreForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      targetVersionId,
    );

    expect(result.restoredFromVersionId).toBe(targetVersionId);
    expect(result.collection.name).toBe("Orders");
    expect(result.version).toMatchObject({
      source: "restore",
      restoredFromVersionId: targetVersionId,
    });

    const endpoints = await collectionsService.listEndpointsForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
    );

    expect(endpoints).toHaveLength(1);
    expect(endpoints[0]).toMatchObject({
      id: firstEndpoint.id,
      name: "First",
    });

    const folders = await collectionsService.listFoldersForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
    );

    expect(folders).toHaveLength(2);
    expect(folders.some((folder) => folder.parentFolderId !== null)).toBe(true);

    const events = await workspaceEventsService.listByCursor(
      workspace.id,
      0,
      200,
    );
    const eventPairs = events.items.map((event) => ({
      entity: event.entity,
      action: event.action,
    }));

    expect(eventPairs).toContainEqual({
      entity: "collection_version",
      action: "restored",
    });
    expect(
      events.items.find(
        (event) =>
          event.entity === "collection_version" && event.action === "restored",
      )?.payload,
    ).toMatchObject({ collectionId: collection.id });
  });

  it("rejects unknown versions and versions from another collection", async () => {
    const owner = await registerOwner();
    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Scope Team",
    });
    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Alpha" },
    );
    const other = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Beta" },
    );

    const otherVersions = await collectionVersionsService.listForCollection(
      owner.user.id,
      workspace.id,
      other.id,
      { limit: 10 },
    );

    await expect(
      collectionVersionsService.getForCollection(
        owner.user.id,
        workspace.id,
        collection.id,
        9999,
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection version not found",
    });

    await expect(
      collectionVersionsService.getForCollection(
        owner.user.id,
        workspace.id,
        collection.id,
        otherVersions.items[0]!.id,
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection version not found",
    });

    await expect(
      collectionVersionsService.restoreForCollection(
        owner.user.id,
        workspace.id,
        collection.id,
        9999,
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection version not found",
    });
  });

  it("lets members read versions but blocks creating and restoring", async () => {
    const owner = await registerOwner();
    const member = await authService.register({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });
    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Roles Team",
    });

    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: member.user.email,
      role: "member",
    });

    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Shared" },
    );

    const listed = await collectionVersionsService.listForCollection(
      member.user.id,
      workspace.id,
      collection.id,
      { limit: 10 },
    );
    expect(listed.items.length).toBeGreaterThan(0);

    const versionId = listed.items[0]!.id;

    await expect(
      collectionVersionsService.createForCollection(
        member.user.id,
        workspace.id,
        collection.id,
        {},
      ),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Only workspace owners and admins can modify collections",
    });

    await expect(
      collectionVersionsService.restoreForCollection(
        member.user.id,
        workspace.id,
        collection.id,
        versionId,
      ),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Only workspace owners and admins can modify collections",
    });

    await expect(
      collectionVersionsService.listForCollection(
        member.user.id,
        999,
        collection.id,
        { limit: 10 },
      ),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("prunes automatic versions beyond the retention limit", async () => {
    const owner = await registerOwner();
    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Retention Team",
    });
    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Churn" },
    );

    for (let index = 0; index < 105; index += 1) {
      await collectionsService.createFolderForCollection(
        owner.user.id,
        workspace.id,
        collection.id,
        { name: `Folder ${index}` },
      );
    }

    const versions = await collectionVersionsService.listForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { limit: 200 },
    );

    expect(versions.items).toHaveLength(100);
    expect(versions.cursor.hasMore).toBe(false);
    expect(versions.items.every((item) => item.source === "auto")).toBe(true);
  });
});
