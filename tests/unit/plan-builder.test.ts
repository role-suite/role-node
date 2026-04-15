import { describe, expect, it } from "vitest";

import type { ExecuteRunInput } from "../../src/internal/runner/core/types.js";
import {
  buildSourceRequest,
  buildVariableContext,
  resolveRunSourcePersistence,
} from "../../src/internal/runner/planning/plan-builder.js";

describe("planBuilder", () => {
  describe("buildSourceRequest", () => {
    it("returns adhoc request as-is", async () => {
      const input: ExecuteRunInput = {
        source: {
          type: "adhoc",
          request: {
            method: "GET",
            url: "https://example.com",
            headers: [{ key: "X-Custom", value: "test", enabled: true }],
            queryParams: [],
            auth: { type: "none" },
            body: { mode: "none" },
          },
        },
        workspaceId: 1,
        initiatedByUserId: 1,
      };

      const result = await buildSourceRequest(input);

      expect(result.method).toBe("GET");
      expect(result.url).toBe("https://example.com");
    });

    it("clones adhoc request without mutation", async () => {
      const original = {
        method: "POST" as const,
        url: "https://example.com",
        headers: [
          { key: "Content-Type", value: "application/json", enabled: true },
        ],
        queryParams: [{ key: "q", value: "search", enabled: true }],
        auth: { type: "none" } as const,
        body: { mode: "raw" as const, raw: '{"a":1}' },
      };
      const input: ExecuteRunInput = {
        source: { type: "adhoc", request: original },
        workspaceId: 1,
        initiatedByUserId: 1,
      };

      const result = await buildSourceRequest(input);

      expect(result.body).not.toBe(original.body);
      result.body = { mode: "raw", raw: '{"b":2}' };
      expect((original.body as { raw: string }).raw).toBe('{"a":1}');
    });
  });

  describe("resolveRunSourcePersistence", () => {
    it("returns adhoc source type", () => {
      const input: ExecuteRunInput = {
        source: {
          type: "adhoc",
          request: {
            method: "GET",
            url: "https://example.com",
            headers: [],
            queryParams: [],
            auth: { type: "none" },
            body: { mode: "none" },
          },
        },
        workspaceId: 1,
        initiatedByUserId: 1,
      };

      const result = resolveRunSourcePersistence(input);

      expect(result).toEqual({
        sourceType: "adhoc",
        sourceCollectionId: null,
        sourceEndpointId: null,
      });
    });

    it("returns collection endpoint source type", () => {
      const input: ExecuteRunInput = {
        source: { type: "collection_endpoint", collectionId: 1, endpointId: 2 },
        workspaceId: 1,
        initiatedByUserId: 1,
      };

      const result = resolveRunSourcePersistence(input);

      expect(result).toEqual({
        sourceType: "collection_endpoint",
        sourceCollectionId: 1,
        sourceEndpointId: 2,
      });
    });
  });

  describe("buildVariableContext", () => {
    it("returns empty context when no environment", async () => {
      const input: ExecuteRunInput = {
        source: {
          type: "adhoc",
          request: {
            method: "GET",
            url: "https://example.com",
            headers: [],
            queryParams: [],
            auth: { type: "none" },
            body: { mode: "none" },
          },
        },
        workspaceId: 1,
        initiatedByUserId: 1,
      };

      const result = await buildVariableContext(input);

      expect(result).toEqual({ values: {}, secretKeys: new Set() });
    });

    it("applies variable overrides", async () => {
      const input: ExecuteRunInput = {
        source: {
          type: "adhoc",
          request: {
            method: "GET",
            url: "https://example.com",
            headers: [],
            queryParams: [],
            auth: { type: "none" },
            body: { mode: "none" },
          },
        },
        workspaceId: 1,
        initiatedByUserId: 1,
        variableOverrides: [
          { key: "BASE_URL", value: "https://override.com" },
          { key: "NEW_VAR", value: "new" },
        ],
      };

      const result = await buildVariableContext(input);

      expect(result.values).toEqual({
        BASE_URL: "https://override.com",
        NEW_VAR: "new",
      });
    });

    it("overrides environment with variable overrides", async () => {
      const input: ExecuteRunInput = {
        source: {
          type: "adhoc",
          request: {
            method: "GET",
            url: "https://example.com",
            headers: [],
            queryParams: [],
            auth: { type: "none" },
            body: { mode: "none" },
          },
        },
        workspaceId: 1,
        initiatedByUserId: 1,
        variableOverrides: [{ key: "BASE_URL", value: "https://override.com" }],
      };

      const result = await buildVariableContext(input);

      expect(result.values).toEqual({ BASE_URL: "https://override.com" });
    });
  });
});
