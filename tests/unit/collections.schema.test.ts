import { describe, expect, it } from "vitest";

import {
  createCollectionEndpointExampleSchema,
  createCollectionEndpointSchema,
  createCollectionFolderSchema,
  createCollectionSchema,
  updateCollectionEndpointExampleSchema,
  updateCollectionEndpointSchema,
  updateCollectionFolderSchema,
  updateCollectionSchema,
  workspaceCollectionByIdParamsSchema,
  workspaceCollectionParamsSchema,
} from "../../src/modules/collections/collections.schema.js";

describe("collections schema", () => {
  it("parses create payload", () => {
    const parsed = createCollectionSchema.parse({
      name: "Orders API",
      description: "Collection for orders endpoints",
    });

    expect(parsed.name).toBe("Orders API");
  });

  it("coerces route params", () => {
    const parsed = workspaceCollectionByIdParamsSchema.parse({
      workspaceId: "2",
      collectionId: "7",
    });

    expect(parsed.workspaceId).toBe(2);
    expect(parsed.collectionId).toBe(7);
  });

  it("rejects empty update payload", () => {
    const result = updateCollectionSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("parses workspace param", () => {
    const parsed = workspaceCollectionParamsSchema.parse({ workspaceId: "4" });
    expect(parsed.workspaceId).toBe(4);
  });

  it("parses endpoint payload", () => {
    const parsed = createCollectionEndpointSchema.parse({
      folderId: null,
      name: "Get Orders",
      method: "GET",
      url: "https://api.example.com/orders",
      headers: [{ key: "Accept", value: "application/json" }],
      queryParams: [{ key: "limit", value: "20" }],
      body: {
        mode: "urlencoded",
        entries: [{ key: "q", value: "search" }],
      },
      auth: { type: "bearer", token: "token-value" },
    });

    expect(parsed.method).toBe("GET");
  });

  it("supports legacy endpoint raw body payload", () => {
    const parsed = createCollectionEndpointSchema.parse({
      name: "Create Order",
      method: "POST",
      url: "https://api.example.com/orders",
      body: {
        raw: "{}",
      },
    });

    expect(parsed.body?.mode).toBe("raw");
  });

  it("rejects empty endpoint update payload", () => {
    const result = updateCollectionEndpointSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("parses create folder payload", () => {
    const parsed = createCollectionFolderSchema.parse({
      name: "Billing",
      parentFolderId: null,
      position: 1,
    });

    expect(parsed.name).toBe("Billing");
  });

  it("rejects empty folder update payload", () => {
    const result = updateCollectionFolderSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("parses endpoint example payload", () => {
    const parsed = createCollectionEndpointExampleSchema.parse({
      name: "200 success",
      statusCode: 200,
      headers: [{ key: "content-type", value: "application/json" }],
      body: '{"ok":true}',
    });

    expect(parsed.statusCode).toBe(200);
  });

  it("rejects empty endpoint example update payload", () => {
    const result = updateCollectionEndpointExampleSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
