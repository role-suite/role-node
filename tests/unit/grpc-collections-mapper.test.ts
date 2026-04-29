import { describe, expect, it } from "vitest";

import {
  toGrpcCollectionEndpointItem,
  toGrpcCollectionExampleItem,
  toGrpcCollectionFolderItem,
  toGrpcCollectionItem,
} from "../../src/grpc/mappers/collections.js";

describe("grpc collections mapper", () => {
  it("maps collection item", () => {
    const item = toGrpcCollectionItem({
      id: 1,
      _id: 1,
      workspaceId: 2,
      name: "My Collection",
      description: null,
      createdByUserId: 3,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(item.workspace_id).toBe(2);
    expect(item.description).toBe("");
  });

  it("maps endpoint folder and example items", () => {
    const endpoint = toGrpcCollectionEndpointItem({
      id: 1,
      collectionId: 2,
      folderId: null,
      name: "Get Users",
      method: "GET",
      url: "/users",
      headers: [],
      queryParams: [],
      body: null,
      auth: null,
      position: 0,
      createdByUserId: 1,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(endpoint.folder_id).toBe(0);

    const folder = toGrpcCollectionFolderItem({
      id: 1,
      collectionId: 2,
      parentFolderId: null,
      name: "Folder",
      position: 0,
      createdByUserId: 1,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(folder.parent_folder_id).toBe(0);

    const example = toGrpcCollectionExampleItem({
      id: 1,
      endpointId: 1,
      name: "OK",
      statusCode: 200,
      headers: [],
      body: null,
      position: 0,
      createdByUserId: 1,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(example.body).toBe("");
  });
});
