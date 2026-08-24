import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  collectionsRepo,
  setCollectionsRepoDbClient,
} from "../../src/modules/collections/repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("collections repo", () => {
  beforeEach(async () => {
    setCollectionsRepoDbClient(testDb);
    await collectionsRepo.clear();
  });

  afterAll(() => {
    setCollectionsRepoDbClient(null);
  });

  describe("collections", () => {
    it("creates a collection", async () => {
      const collection = await collectionsRepo.create({
        workspaceId: 1,
        name: "Test Collection",
        description: "A test collection",
        createdByUserId: 1,
      });

      expect(collection.id).toBe(1);
      expect(collection.workspaceId).toBe(1);
      expect(collection.name).toBe("Test Collection");
      expect(collection.description).toBe("A test collection");
      expect(collection.createdByUserId).toBe(1);
    });

    it("lists collections by workspace", async () => {
      await collectionsRepo.create({
        workspaceId: 1,
        name: "Collection One",
        description: null,
        createdByUserId: 1,
      });
      await collectionsRepo.create({
        workspaceId: 1,
        name: "Collection Two",
        description: null,
        createdByUserId: 1,
      });
      await collectionsRepo.create({
        workspaceId: 2,
        name: "Other Workspace Collection",
        description: null,
        createdByUserId: 1,
      });

      const collections = await collectionsRepo.listByWorkspace(1);

      expect(collections).toHaveLength(2);
      expect(collections[0].name).toBe("Collection One");
      expect(collections[1].name).toBe("Collection Two");
    });

    it("finds collection by id", async () => {
      const created = await collectionsRepo.create({
        workspaceId: 1,
        name: "Find Me",
        description: null,
        createdByUserId: 1,
      });

      const found = await collectionsRepo.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe("Find Me");
    });

    it("returns undefined for non-existent collection", async () => {
      const found = await collectionsRepo.findById(999);

      expect(found).toBeUndefined();
    });

    it("updates a collection", async () => {
      const created = await collectionsRepo.create({
        workspaceId: 1,
        name: "Original Name",
        description: null,
        createdByUserId: 1,
      });

      await collectionsRepo.update({
        id: created.id,
        name: "Updated Name",
        description: "New description",
      });

      const found = await collectionsRepo.findById(created.id);

      expect(found?.name).toBe("Updated Name");
      expect(found?.description).toBe("New description");
    });

    it("deletes a collection", async () => {
      const created = await collectionsRepo.create({
        workspaceId: 1,
        name: "To Delete",
        description: null,
        createdByUserId: 1,
      });

      await collectionsRepo.deleteById(created.id);

      const found = await collectionsRepo.findById(created.id);

      expect(found).toBeUndefined();
    });
  });

  describe("endpoints", () => {
    it("creates an endpoint", async () => {
      const endpoint = await collectionsRepo.createEndpoint({
        collectionId: 1,
        folderId: null,
        name: "Get Users",
        method: "GET",
        url: "https://api.example.com/users",
        headers: "{}",
        queryParams: "{}",
        body: null,
        auth: null,
        position: 1,
        createdByUserId: 1,
      });

      expect(endpoint.id).toBe(1);
      expect(endpoint.collectionId).toBe(1);
      expect(endpoint.name).toBe("Get Users");
      expect(endpoint.method).toBe("GET");
      expect(endpoint.url).toBe("https://api.example.com/users");
    });

    it("creates endpoint with folder", async () => {
      const endpoint = await collectionsRepo.createEndpoint({
        collectionId: 1,
        folderId: 5,
        name: "In Folder",
        method: "POST",
        url: "https://api.example.com/items",
        headers: "{}",
        queryParams: "{}",
        body: "{}",
        auth: null,
        position: 1,
        createdByUserId: 1,
      });

      expect(endpoint.folderId).toBe(5);
    });

    it("lists endpoints by collection", async () => {
      await collectionsRepo.createEndpoint({
        collectionId: 1,
        folderId: null,
        name: "Endpoint A",
        method: "GET",
        url: "https://api.example.com/a",
        headers: "{}",
        queryParams: "{}",
        body: null,
        auth: null,
        position: 2,
        createdByUserId: 1,
      });
      await collectionsRepo.createEndpoint({
        collectionId: 1,
        folderId: null,
        name: "Endpoint B",
        method: "GET",
        url: "https://api.example.com/b",
        headers: "{}",
        queryParams: "{}",
        body: null,
        auth: null,
        position: 1,
        createdByUserId: 1,
      });

      const endpoints = await collectionsRepo.listEndpointsByCollection(1);

      expect(endpoints).toHaveLength(2);
      expect(endpoints[0].name).toBe("Endpoint B");
      expect(endpoints[1].name).toBe("Endpoint A");
    });

    it("finds endpoint by id", async () => {
      const created = await collectionsRepo.createEndpoint({
        collectionId: 1,
        folderId: null,
        name: "Find Endpoint",
        method: "GET",
        url: "https://api.example.com/find",
        headers: "{}",
        queryParams: "{}",
        body: null,
        auth: null,
        position: 1,
        createdByUserId: 1,
      });

      const found = await collectionsRepo.findEndpointById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it("updates endpoint", async () => {
      const created = await collectionsRepo.createEndpoint({
        collectionId: 1,
        folderId: null,
        name: "Original",
        method: "GET",
        url: "https://api.example.com/original",
        headers: "{}",
        queryParams: "{}",
        body: null,
        auth: null,
        position: 1,
        createdByUserId: 1,
      });

      await collectionsRepo.updateEndpoint({
        id: created.id,
        folderId: 2,
        name: "Updated",
        method: "POST",
        url: "https://api.example.com/updated",
        headers: '{"Content-Type": "application/json"}',
        queryParams: '{"page": 1}',
        body: '{"key": "value"}',
        auth: null,
        position: 5,
      });

      const found = await collectionsRepo.findEndpointById(created.id);

      expect(found?.name).toBe("Updated");
      expect(found?.method).toBe("POST");
      expect(found?.url).toBe("https://api.example.com/updated");
      expect(found?.folderId).toBe(2);
    });

    it("deletes endpoint", async () => {
      const created = await collectionsRepo.createEndpoint({
        collectionId: 1,
        folderId: null,
        name: "To Delete",
        method: "GET",
        url: "https://api.example.com/delete",
        headers: "{}",
        queryParams: "{}",
        body: null,
        auth: null,
        position: 1,
        createdByUserId: 1,
      });

      await collectionsRepo.deleteEndpointById(created.id);

      const found = await collectionsRepo.findEndpointById(created.id);

      expect(found).toBeUndefined();
    });
  });

  describe("folders", () => {
    it("creates a folder", async () => {
      const folder = await collectionsRepo.createFolder({
        collectionId: 1,
        parentFolderId: null,
        name: "Users",
        position: 1,
        createdByUserId: 1,
      });

      expect(folder.id).toBe(1);
      expect(folder.collectionId).toBe(1);
      expect(folder.name).toBe("Users");
    });

    it("creates nested folder", async () => {
      const folder = await collectionsRepo.createFolder({
        collectionId: 1,
        parentFolderId: 3,
        name: "Nested",
        position: 1,
        createdByUserId: 1,
      });

      expect(folder.parentFolderId).toBe(3);
    });

    it("lists folders by collection", async () => {
      await collectionsRepo.createFolder({
        collectionId: 1,
        parentFolderId: null,
        name: "Folder A",
        position: 2,
        createdByUserId: 1,
      });
      await collectionsRepo.createFolder({
        collectionId: 1,
        parentFolderId: null,
        name: "Folder B",
        position: 1,
        createdByUserId: 1,
      });

      const folders = await collectionsRepo.listFoldersByCollection(1);

      expect(folders).toHaveLength(2);
      expect(folders[0].name).toBe("Folder B");
      expect(folders[1].name).toBe("Folder A");
    });

    it("finds folder by id", async () => {
      const created = await collectionsRepo.createFolder({
        collectionId: 1,
        parentFolderId: null,
        name: "Find Me",
        position: 1,
        createdByUserId: 1,
      });

      const found = await collectionsRepo.findFolderById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it("updates folder", async () => {
      const created = await collectionsRepo.createFolder({
        collectionId: 1,
        parentFolderId: null,
        name: "Original",
        position: 1,
        createdByUserId: 1,
      });

      await collectionsRepo.updateFolder({
        id: created.id,
        parentFolderId: 5,
        name: "Updated",
        position: 10,
      });

      const found = await collectionsRepo.findFolderById(created.id);

      expect(found?.name).toBe("Updated");
      expect(found?.parentFolderId).toBe(5);
    });

    it("deletes folder", async () => {
      const created = await collectionsRepo.createFolder({
        collectionId: 1,
        parentFolderId: null,
        name: "To Delete",
        position: 1,
        createdByUserId: 1,
      });

      await collectionsRepo.deleteFolderById(created.id);

      const found = await collectionsRepo.findFolderById(created.id);

      expect(found).toBeUndefined();
    });
  });

  describe("endpoint examples", () => {
    it("creates endpoint example", async () => {
      const example = await collectionsRepo.createEndpointExample({
        endpointId: 1,
        name: "Success Response",
        statusCode: 200,
        headers: "{}",
        body: '{"success": true}',
        position: 1,
        createdByUserId: 1,
      });

      expect(example.id).toBe(1);
      expect(example.endpointId).toBe(1);
      expect(example.name).toBe("Success Response");
      expect(example.statusCode).toBe(200);
    });

    it("lists examples by endpoint", async () => {
      await collectionsRepo.createEndpointExample({
        endpointId: 1,
        name: "Example A",
        statusCode: 200,
        headers: "{}",
        body: "a",
        position: 2,
        createdByUserId: 1,
      });
      await collectionsRepo.createEndpointExample({
        endpointId: 1,
        name: "Example B",
        statusCode: 201,
        headers: "{}",
        body: "b",
        position: 1,
        createdByUserId: 1,
      });

      const examples = await collectionsRepo.listExamplesByEndpoint(1);

      expect(examples).toHaveLength(2);
      expect(examples[0].name).toBe("Example B");
      expect(examples[1].name).toBe("Example A");
    });

    it("finds example by id", async () => {
      const created = await collectionsRepo.createEndpointExample({
        endpointId: 1,
        name: "Find Me",
        statusCode: 200,
        headers: "{}",
        body: null,
        position: 1,
        createdByUserId: 1,
      });

      const found = await collectionsRepo.findExampleById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it("updates example", async () => {
      const created = await collectionsRepo.createEndpointExample({
        endpointId: 1,
        name: "Original",
        statusCode: 200,
        headers: "{}",
        body: null,
        position: 1,
        createdByUserId: 1,
      });

      await collectionsRepo.updateExample({
        id: created.id,
        name: "Updated",
        statusCode: 201,
        headers: '{"Content-Type": "application/json"}',
        body: '{"updated": true}',
        position: 5,
      });

      const found = await collectionsRepo.findExampleById(created.id);

      expect(found?.name).toBe("Updated");
      expect(found?.statusCode).toBe(201);
    });

    it("deletes example", async () => {
      const created = await collectionsRepo.createEndpointExample({
        endpointId: 1,
        name: "To Delete",
        statusCode: 200,
        headers: "{}",
        body: null,
        position: 1,
        createdByUserId: 1,
      });

      await collectionsRepo.deleteExampleById(created.id);

      const found = await collectionsRepo.findExampleById(created.id);

      expect(found).toBeUndefined();
    });
  });
});
