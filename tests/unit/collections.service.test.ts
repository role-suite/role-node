import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { authRepo, setAuthRepoDbClient } from "../../src/modules/auth/repo.js";
import { authService } from "../../src/modules/auth/service.js";
import { collectionsService } from "../../src/modules/collections/service.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/repo.js";
import { workspacesService } from "../../src/modules/workspaces/service.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("collections service", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
  });

  it("allows owner to create, update and delete collections", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Collections Team",
    });

    const created = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Orders", description: "Orders API" },
    );

    expect(created.name).toBe("Orders");
    expect(created._id).toBe(created.id);

    const updated = await collectionsService.updateForWorkspace(
      owner.user.id,
      workspace.id,
      created.id,
      { name: "Orders v2" },
    );

    expect(updated.name).toBe("Orders v2");
    expect(updated._id).toBe(updated.id);

    await collectionsService.deleteForWorkspace(
      owner.user.id,
      workspace.id,
      created.id,
    );

    await expect(
      collectionsService.getByIdForWorkspace(
        owner.user.id,
        workspace.id,
        created.id,
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection not found",
    });
  });

  it("allows members to read but not modify collections", async () => {
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
      name: "Read Team",
    });

    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: member.user.email,
      role: "member",
    });

    const created = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Catalog" },
    );

    const listed = await collectionsService.listForWorkspace(
      member.user.id,
      workspace.id,
    );
    expect(listed).toHaveLength(1);

    await expect(
      collectionsService.createForWorkspace(member.user.id, workspace.id, {
        name: "Should Fail",
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Only workspace owners and admins can modify collections",
    });

    const readOne = await collectionsService.getByIdForWorkspace(
      member.user.id,
      workspace.id,
      created.id,
    );
    expect(readOne.id).toBe(created.id);
    expect(readOne._id).toBe(created.id);
  });

  it("allows owner to manage collection endpoints", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Endpoints Team",
    });

    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Orders API" },
    );

    const endpoint = await collectionsService.createEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      {
        name: "Get Orders",
        method: "GET",
        url: "https://api.example.com/orders",
        queryParams: [{ key: "limit", value: "20" }],
      },
    );

    expect(endpoint.method).toBe("GET");

    const listed = await collectionsService.listEndpointsForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
    );
    expect(listed).toHaveLength(1);

    const updated = await collectionsService.updateEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      endpoint.id,
      { method: "POST", body: { mode: "raw", raw: "{}" } },
    );

    expect(updated.method).toBe("POST");

    await collectionsService.deleteEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      endpoint.id,
    );

    await expect(
      collectionsService.getEndpointByIdForCollection(
        owner.user.id,
        workspace.id,
        collection.id,
        endpoint.id,
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection endpoint not found",
    });
  });

  it("allows members to read but blocks endpoint writes", async () => {
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
      name: "Read Endpoints Team",
    });

    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: member.user.email,
      role: "member",
    });

    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Payments API" },
    );

    const endpoint = await collectionsService.createEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      {
        name: "Get Payments",
        method: "GET",
        url: "https://api.example.com/payments",
      },
    );

    const readOne = await collectionsService.getEndpointByIdForCollection(
      member.user.id,
      workspace.id,
      collection.id,
      endpoint.id,
    );
    expect(readOne.id).toBe(endpoint.id);

    await expect(
      collectionsService.createEndpointForCollection(
        member.user.id,
        workspace.id,
        collection.id,
        {
          name: "Create Payment",
          method: "POST",
          url: "https://api.example.com/payments",
        },
      ),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Only workspace owners and admins can modify collections",
    });
  });

  it("allows owner to manage endpoint examples", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Examples Team",
    });

    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "Test API" },
    );

    const endpoint = await collectionsService.createEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { name: "Get Test", method: "GET", url: "https://api.example.com/test" },
    );

    const example = await collectionsService.createExampleForEndpoint(
      owner.user.id,
      workspace.id,
      collection.id,
      endpoint.id,
      { name: "Success", statusCode: 200, headers: {}, body: '{"ok": true}' },
    );

    expect(example.name).toBe("Success");
    expect(example.statusCode).toBe(200);

    const examples = await collectionsService.listExamplesForEndpoint(
      owner.user.id,
      workspace.id,
      collection.id,
      endpoint.id,
    );
    expect(examples).toHaveLength(1);

    const updated = await collectionsService.updateExampleForEndpoint(
      owner.user.id,
      workspace.id,
      collection.id,
      endpoint.id,
      example.id,
      { name: "Updated" },
    );
    expect(updated.name).toBe("Updated");

    await collectionsService.deleteExampleForEndpoint(
      owner.user.id,
      workspace.id,
      collection.id,
      endpoint.id,
      example.id,
    );

    const remainingExamples = await collectionsService.listExamplesForEndpoint(
      owner.user.id,
      workspace.id,
      collection.id,
      endpoint.id,
    );
    expect(remainingExamples).toHaveLength(0);
  });

  it("blocks non-writers from managing examples", async () => {
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
      name: "Members Team",
    });

    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: member.user.email,
      role: "member",
    });

    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "API" },
    );

    const endpoint = await collectionsService.createEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { name: "Get", method: "GET", url: "https://api.example.com" },
    );

    await expect(
      collectionsService.createExampleForEndpoint(
        member.user.id,
        workspace.id,
        collection.id,
        endpoint.id,
        { name: "Fail", statusCode: 200, headers: {} },
      ),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("allows owner to manage folders", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Folders Team",
    });

    const collection = await collectionsService.createForWorkspace(
      owner.user.id,
      workspace.id,
      { name: "API" },
    );

    const folder = await collectionsService.createFolderForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      { name: "Users", position: 1 },
    );

    expect(folder.name).toBe("Users");
    expect(folder.collectionId).toBe(collection.id);

    const folders = await collectionsService.listFoldersForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
    );
    expect(folders).toHaveLength(1);

    const endpoint = await collectionsService.createEndpointForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      {
        name: "In Folder",
        method: "GET",
        url: "https://api.example.com",
        folderId: folder.id,
      },
    );
    expect(endpoint.folderId).toBe(folder.id);

    await collectionsService.deleteFolderForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
      folder.id,
    );

    const remainingFolders = await collectionsService.listFoldersForCollection(
      owner.user.id,
      workspace.id,
      collection.id,
    );
    expect(remainingFolders).toHaveLength(0);
  });
});
