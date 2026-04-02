import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  findMembershipByUserAndWorkspaceMock,
  findWorkspaceByIdMock,
  findByIdMock,
  findEndpointByIdMock,
  findFolderByIdMock,
  listFoldersByCollectionMock,
  createFolderMock,
  updateFolderMock,
  deleteFolderByIdMock,
  listExamplesByEndpointMock,
  createEndpointExampleMock,
  findExampleByIdMock,
  updateExampleMock,
  deleteExampleByIdMock,
  deleteEndpointByIdMock,
  publishMock,
} = vi.hoisted(() => ({
  findMembershipByUserAndWorkspaceMock: vi.fn(),
  findWorkspaceByIdMock: vi.fn(),
  findByIdMock: vi.fn(),
  findEndpointByIdMock: vi.fn(),
  findFolderByIdMock: vi.fn(),
  listFoldersByCollectionMock: vi.fn(),
  createFolderMock: vi.fn(),
  updateFolderMock: vi.fn(),
  deleteFolderByIdMock: vi.fn(),
  listExamplesByEndpointMock: vi.fn(),
  createEndpointExampleMock: vi.fn(),
  findExampleByIdMock: vi.fn(),
  updateExampleMock: vi.fn(),
  deleteExampleByIdMock: vi.fn(),
  deleteEndpointByIdMock: vi.fn(),
  publishMock: vi.fn(),
}));

vi.mock("../../src/modules/auth/auth.repo.js", () => ({
  authRepo: {
    findMembershipByUserAndWorkspace: findMembershipByUserAndWorkspaceMock,
    findWorkspaceById: findWorkspaceByIdMock,
  },
}));

vi.mock("../../src/modules/collections/collections.repo.js", () => ({
  collectionsRepo: {
    findById: findByIdMock,
    findEndpointById: findEndpointByIdMock,
    findFolderById: findFolderByIdMock,
    listFoldersByCollection: listFoldersByCollectionMock,
    createFolder: createFolderMock,
    updateFolder: updateFolderMock,
    deleteFolderById: deleteFolderByIdMock,
    listExamplesByEndpoint: listExamplesByEndpointMock,
    createEndpointExample: createEndpointExampleMock,
    findExampleById: findExampleByIdMock,
    updateExample: updateExampleMock,
    deleteExampleById: deleteExampleByIdMock,
    deleteEndpointById: deleteEndpointByIdMock,
  },
}));

vi.mock("../../src/modules/workspaces/workspace-events.service.js", () => ({
  workspaceEventsService: {
    publish: publishMock,
  },
}));

import { collectionsService } from "../../src/modules/collections/collections.service.js";

const now = new Date("2026-01-01T00:00:00.000Z");

describe("collections service branches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findMembershipByUserAndWorkspaceMock.mockResolvedValue({ role: "owner" });
    findWorkspaceByIdMock.mockResolvedValue({ id: 5 });
    findByIdMock.mockResolvedValue({
      id: 20,
      workspaceId: 5,
      name: "Collection",
      description: null,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });
    findEndpointByIdMock.mockResolvedValue({
      id: 30,
      collectionId: 20,
      folderId: null,
      name: "Endpoint",
      method: "GET",
      url: "https://api.example.com",
      headers: "[]",
      queryParams: "[]",
      body: null,
      auth: null,
      position: 0,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });
    findFolderByIdMock.mockResolvedValue({
      id: 40,
      collectionId: 20,
      parentFolderId: null,
      name: "Root",
      position: 0,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });
    findExampleByIdMock.mockResolvedValue({
      id: 60,
      endpointId: 30,
      name: "200",
      statusCode: 200,
      headers: "[]",
      body: null,
      position: 0,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });
  });

  it("lists and creates folders", async () => {
    listFoldersByCollectionMock.mockResolvedValue([
      {
        id: 40,
        collectionId: 20,
        parentFolderId: null,
        name: "Root",
        position: 0,
        createdByUserId: 1,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    createFolderMock.mockResolvedValue({
      id: 41,
      collectionId: 20,
      parentFolderId: 40,
      name: "Child",
      position: 1,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });

    const folders = await collectionsService.listFoldersForCollection(1, 5, 20);
    expect(folders).toHaveLength(1);

    const created = await collectionsService.createFolderForCollection(
      1,
      5,
      20,
      {
        name: "Child",
        parentFolderId: 40,
        position: 1,
      },
    );

    expect(created.id).toBe(41);
    expect(createFolderMock).toHaveBeenCalledWith(
      expect.objectContaining({ parentFolderId: 40 }),
    );
    expect(publishMock).toHaveBeenCalled();
  });

  it("updates folder and throws when updated folder cannot be fetched", async () => {
    findFolderByIdMock
      .mockResolvedValueOnce({
        id: 40,
        collectionId: 20,
        parentFolderId: null,
        name: "Root",
        position: 0,
        createdByUserId: 1,
        createdAt: now,
        updatedAt: now,
      })
      .mockResolvedValueOnce(undefined);

    await expect(
      collectionsService.updateFolderForCollection(1, 5, 20, 40, {
        name: "New",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection folder not found",
    });

    expect(updateFolderMock).toHaveBeenCalled();
  });

  it("rejects folder self-parent assignment", async () => {
    findFolderByIdMock.mockResolvedValue({
      id: 40,
      collectionId: 20,
      parentFolderId: null,
      name: "Root",
      position: 0,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });

    await expect(
      collectionsService.updateFolderForCollection(1, 5, 20, 40, {
        parentFolderId: 40,
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Folder cannot be its own parent",
    });
  });

  it("deletes folder and publishes event", async () => {
    deleteFolderByIdMock.mockResolvedValue(undefined);

    await collectionsService.deleteFolderForCollection(1, 5, 20, 40);

    expect(deleteFolderByIdMock).toHaveBeenCalledWith(40);
    expect(publishMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "deleted",
        entity: "collection_folder",
      }),
    );
  });

  it("handles example list/create/update/delete success path", async () => {
    listExamplesByEndpointMock.mockResolvedValue([
      {
        id: 60,
        endpointId: 30,
        name: "200",
        statusCode: 200,
        headers: '[{"key":"content-type","value":"application/json"}]',
        body: "{}",
        position: 0,
        createdByUserId: 1,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    createEndpointExampleMock.mockResolvedValue({
      id: 61,
      endpointId: 30,
      name: "201",
      statusCode: 201,
      headers: "[]",
      body: "{}",
      position: 0,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });
    updateExampleMock.mockResolvedValue(undefined);
    findExampleByIdMock
      .mockResolvedValueOnce({
        id: 60,
        endpointId: 30,
        name: "200",
        statusCode: 200,
        headers: "[]",
        body: null,
        position: 0,
        createdByUserId: 1,
        createdAt: now,
        updatedAt: now,
      })
      .mockResolvedValueOnce({
        id: 60,
        endpointId: 30,
        name: "202",
        statusCode: 202,
        headers: "[]",
        body: "{}",
        position: 0,
        createdByUserId: 1,
        createdAt: now,
        updatedAt: now,
      });

    const examples = await collectionsService.listExamplesForEndpoint(
      1,
      5,
      20,
      30,
    );
    expect(examples[0]?.headers[0]?.key).toBe("content-type");

    const created = await collectionsService.createExampleForEndpoint(
      1,
      5,
      20,
      30,
      {
        name: "201",
      },
    );
    expect(created.id).toBe(61);

    const updated = await collectionsService.updateExampleForEndpoint(
      1,
      5,
      20,
      30,
      60,
      { name: "202", statusCode: 202, body: "{}" },
    );
    expect(updated.name).toBe("202");

    await collectionsService.deleteExampleForEndpoint(1, 5, 20, 30, 60);
    expect(deleteExampleByIdMock).toHaveBeenCalledWith(60);
  });

  it("throws on missing endpoint/example branches", async () => {
    findEndpointByIdMock.mockResolvedValueOnce(undefined);
    await expect(
      collectionsService.listExamplesForEndpoint(1, 5, 20, 30),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection endpoint not found",
    });

    findEndpointByIdMock.mockResolvedValue({
      id: 30,
      collectionId: 20,
      folderId: null,
      name: "Endpoint",
      method: "GET",
      url: "https://api.example.com",
      headers: "[]",
      queryParams: "[]",
      body: null,
      auth: null,
      position: 0,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });
    findExampleByIdMock.mockResolvedValueOnce(undefined);

    await expect(
      collectionsService.updateExampleForEndpoint(1, 5, 20, 30, 60, {
        name: "new",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection endpoint example not found",
    });

    findExampleByIdMock.mockResolvedValueOnce({
      id: 60,
      endpointId: 30,
      name: "200",
      statusCode: 200,
      headers: "[]",
      body: null,
      position: 0,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });
    findExampleByIdMock.mockResolvedValueOnce(undefined);

    await expect(
      collectionsService.updateExampleForEndpoint(1, 5, 20, 30, 60, {
        name: "new",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection endpoint example not found",
    });
  });

  it("throws when deleting endpoint that does not belong to collection", async () => {
    findEndpointByIdMock.mockResolvedValueOnce({
      id: 30,
      collectionId: 999,
      folderId: null,
      name: "Endpoint",
      method: "GET",
      url: "https://api.example.com",
      headers: "[]",
      queryParams: "[]",
      body: null,
      auth: null,
      position: 0,
      createdByUserId: 1,
      createdAt: now,
      updatedAt: now,
    });

    await expect(
      collectionsService.deleteEndpointForCollection(1, 5, 20, 30),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Collection endpoint not found",
    });

    expect(deleteEndpointByIdMock).not.toHaveBeenCalled();
  });
});
