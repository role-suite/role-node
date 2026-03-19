import { describe, expect, it } from "vitest";

import {
  createCollectionEndpointSchema,
  createCollectionSchema,
  updateCollectionEndpointSchema,
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
      name: "Get Orders",
      method: "GET",
      url: "https://api.example.com/orders",
      headers: [{ key: "Accept", value: "application/json" }],
      queryParams: [{ key: "limit", value: "20" }],
      auth: { type: "bearer", token: "token-value" },
    });

    expect(parsed.method).toBe("GET");
  });

  it("rejects empty endpoint update payload", () => {
    const result = updateCollectionEndpointSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
