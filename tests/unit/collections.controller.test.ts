import { describe, expect, it, vi } from "vitest";

const {
  listFoldersForCollectionMock,
  createFolderForCollectionMock,
  updateFolderForCollectionMock,
  deleteFolderForCollectionMock,
  listExamplesForEndpointMock,
  createExampleForEndpointMock,
  updateExampleForEndpointMock,
  deleteExampleForEndpointMock,
} = vi.hoisted(() => ({
  listFoldersForCollectionMock: vi.fn(),
  createFolderForCollectionMock: vi.fn(),
  updateFolderForCollectionMock: vi.fn(),
  deleteFolderForCollectionMock: vi.fn(),
  listExamplesForEndpointMock: vi.fn(),
  createExampleForEndpointMock: vi.fn(),
  updateExampleForEndpointMock: vi.fn(),
  deleteExampleForEndpointMock: vi.fn(),
}));

vi.mock("../../src/modules/collections/service.js", () => ({
  collectionsService: {
    listFoldersForCollection: listFoldersForCollectionMock,
    createFolderForCollection: createFolderForCollectionMock,
    updateFolderForCollection: updateFolderForCollectionMock,
    deleteFolderForCollection: deleteFolderForCollectionMock,
    listExamplesForEndpoint: listExamplesForEndpointMock,
    createExampleForEndpoint: createExampleForEndpointMock,
    updateExampleForEndpoint: updateExampleForEndpointMock,
    deleteExampleForEndpoint: deleteExampleForEndpointMock,
  },
}));

import { collectionsController } from "../../src/modules/collections/controller.js";

const createResponse = () => {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
};

describe("collections controller", () => {
  it("handles folder endpoints", async () => {
    const response = createResponse();
    listFoldersForCollectionMock.mockResolvedValue([{ id: 1, name: "Root" }]);
    createFolderForCollectionMock.mockResolvedValue({ id: 2, name: "Child" });
    updateFolderForCollectionMock.mockResolvedValue({
      id: 2,
      name: "Child v2",
    });
    deleteFolderForCollectionMock.mockResolvedValue(undefined);

    const reqBase = {
      auth: { userId: 7 },
      params: { workspaceId: "3", collectionId: "9", folderId: "2" },
    };

    await collectionsController.listFolders(
      reqBase as never,
      response as never,
    );
    expect(listFoldersForCollectionMock).toHaveBeenCalledWith(7, 3, 9);

    await collectionsController.createFolder(
      { ...reqBase, body: { name: "Child" } } as never,
      response as never,
    );
    expect(createFolderForCollectionMock).toHaveBeenCalledWith(7, 3, 9, {
      name: "Child",
    });

    await collectionsController.updateFolder(
      { ...reqBase, body: { name: "Child v2" } } as never,
      response as never,
    );
    expect(updateFolderForCollectionMock).toHaveBeenCalledWith(7, 3, 9, 2, {
      name: "Child v2",
    });

    await collectionsController.removeFolder(
      reqBase as never,
      response as never,
    );
    expect(deleteFolderForCollectionMock).toHaveBeenCalledWith(7, 3, 9, 2);
  });

  it("handles endpoint example endpoints", async () => {
    const response = createResponse();
    listExamplesForEndpointMock.mockResolvedValue([{ id: 11, name: "200" }]);
    createExampleForEndpointMock.mockResolvedValue({ id: 12, name: "201" });
    updateExampleForEndpointMock.mockResolvedValue({ id: 12, name: "202" });
    deleteExampleForEndpointMock.mockResolvedValue(undefined);

    const reqBase = {
      auth: { userId: 7 },
      params: {
        workspaceId: "3",
        collectionId: "9",
        endpointId: "4",
        exampleId: "12",
      },
    };

    await collectionsController.listEndpointExamples(
      reqBase as never,
      response as never,
    );
    expect(listExamplesForEndpointMock).toHaveBeenCalledWith(7, 3, 9, 4);

    await collectionsController.createEndpointExample(
      { ...reqBase, body: { name: "201" } } as never,
      response as never,
    );
    expect(createExampleForEndpointMock).toHaveBeenCalledWith(7, 3, 9, 4, {
      name: "201",
    });

    await collectionsController.updateEndpointExample(
      { ...reqBase, body: { name: "202" } } as never,
      response as never,
    );
    expect(updateExampleForEndpointMock).toHaveBeenCalledWith(7, 3, 9, 4, 12, {
      name: "202",
    });

    await collectionsController.removeEndpointExample(
      reqBase as never,
      response as never,
    );
    expect(deleteExampleForEndpointMock).toHaveBeenCalledWith(7, 3, 9, 4, 12);
  });

  it("rejects requests without auth context", async () => {
    const response = createResponse();

    await expect(
      collectionsController.listFolders(
        { params: { workspaceId: "3", collectionId: "9" } } as never,
        response as never,
      ),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Missing authenticated context",
    });
  });
});
