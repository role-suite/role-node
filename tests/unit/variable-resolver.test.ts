import { describe, expect, it } from "vitest";

import { resolveVariables } from "../../src/internal/runner/planning/variable-resolver.js";
import type { HttpRequestDraft } from "../../src/internal/runner/core/types.js";

const createRequest = (
  overrides?: Partial<HttpRequestDraft>,
): HttpRequestDraft => ({
  method: "GET",
  url: "https://api.example.com",
  headers: [],
  queryParams: [],
  auth: { type: "none" },
  body: { mode: "none" },
  ...overrides,
});

describe("variableResolver", () => {
  describe("resolveString", () => {
    it("replaces variables in string", () => {
      const result = "Hello {{name}}".replace(
        /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/gu,
        (_, key) => {
          const context = { name: "World" };
          return context[key] ?? _;
        },
      );
      expect(result).toBe("Hello World");
    });

    it("leaves unmatched variables", () => {
      const result = "Hello {{unknown}}".replace(
        /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/gu,
        (_, key) => {
          const context: Record<string, string> = { name: "World" };
          return context[key] ?? _;
        },
      );
      expect(result).toBe("Hello {{unknown}}");
    });

    it("handles multiple variables", () => {
      const result = "{{greeting}} {{name}}".replace(
        /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/gu,
        (_, key) => {
          const context = { greeting: "Hello", name: "World" };
          return context[key] ?? _;
        },
      );
      expect(result).toBe("Hello World");
    });

    it("handles nested key path", () => {
      const result = "{{user.name}}".replace(
        /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/gu,
        (_, key) => {
          const context: Record<string, string> = { "user.name": "John" };
          return context[key] ?? _;
        },
      );
      expect(result).toBe("John");
    });

    it("trims whitespace around variables", () => {
      const result = "{{  name  }}".replace(
        /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/gu,
        (_, key) => {
          const context = { name: "World" };
          return context[key] ?? _;
        },
      );
      expect(result).toBe("World");
    });
  });

  describe("resolveVariables", () => {
    it("resolves url variables", () => {
      const request = createRequest({ url: "https://{{host}}.example.com" });
      const context = { host: "api" };

      const result = resolveVariables(request, context);

      expect(result.url).toBe("https://api.example.com");
    });

    it("resolves header values", () => {
      const request = createRequest({
        headers: [
          { key: "Authorization", value: "Bearer {{token}}", enabled: true },
        ],
      });
      const context = { token: "abc123" };

      const result = resolveVariables(request, context);

      expect(result.headers[0].value).toBe("Bearer abc123");
    });

    it("resolves query param values", () => {
      const request = createRequest({
        queryParams: [{ key: "api_key", value: "{{key}}", enabled: true }],
      });
      const context = { key: "secret" };

      const result = resolveVariables(request, context);

      expect(result.queryParams[0].value).toBe("secret");
    });

    it("resolves raw body", () => {
      const request = createRequest({
        body: { mode: "raw", raw: '{"name": "{{name}}"}' },
      });
      const context = { name: "John" };

      const result = resolveVariables(request, context);

      expect(result.body?.mode).toBe("raw");
      expect((result.body as { raw: string }).raw).toBe('{"name": "John"}');
    });

    it("resolves urlencoded body entries", () => {
      const request = createRequest({
        body: {
          mode: "urlencoded",
          entries: [{ key: "username", value: "{{user}}" }],
        },
      });
      const context = { user: "john" };

      const result = resolveVariables(request, context);

      const body = result.body as {
        mode: string;
        entries: { key: string; value: string }[];
      };
      expect(body.entries[0].value).toBe("john");
    });

    it("resolves formdata text entries", () => {
      const request = createRequest({
        body: {
          mode: "formdata",
          entries: [
            { type: "text", key: "username", value: "{{user}}" },
            { type: "file", key: "file", fileName: "{{filename}}" },
          ],
        },
      });
      const context = { user: "john", filename: "test.txt" };

      const result = resolveVariables(request, context);

      const body = result.body as {
        mode: string;
        entries: { type: string; value?: string; fileName?: string }[];
      };
      expect(body.entries[0].value).toBe("john");
      expect(body.entries[1].fileName).toBe("test.txt");
    });

    it("resolves binary body filename", () => {
      const request = createRequest({
        body: { mode: "binary", fileName: "{{filename}}" },
      });
      const context = { filename: "image.png" };

      const result = resolveVariables(request, context);

      const body = result.body as { mode: string; fileName: string };
      expect(body.fileName).toBe("image.png");
    });

    it("resolves bearer token", () => {
      const request = createRequest({
        auth: { type: "bearer", token: "{{token}}" },
      });
      const context = { token: "abc123" };

      const result = resolveVariables(request, context);

      expect(result.auth).toEqual({ type: "bearer", token: "abc123" });
    });

    it("resolves basic auth credentials", () => {
      const request = createRequest({
        auth: { type: "basic", username: "{{user}}", password: "{{pass}}" },
      });
      const context = { user: "john", pass: "secret" };

      const result = resolveVariables(request, context);

      expect(result.auth).toEqual({
        type: "basic",
        username: "john",
        password: "secret",
      });
    });

    it("preserves none auth", () => {
      const request = createRequest({ auth: { type: "none" } });
      const context = { token: "abc" };

      const result = resolveVariables(request, context);

      expect(result.auth).toEqual({ type: "none" });
    });

    it("handles null body", () => {
      const request = createRequest({ body: null });
      const context = { value: "test" };

      const result = resolveVariables(request, context);

      expect(result.body).toBeNull();
    });

    it("leaves unresolved variables unchanged", () => {
      const request = createRequest({ url: "{{unknown}}" });
      const context = { other: "value" };

      const result = resolveVariables(request, context);

      expect(result.url).toBe("{{unknown}}");
    });

    it("resolves multiple variables in same string", () => {
      const request = createRequest({
        url: "https://{{subdomain}}.example.com/{{version}}/endpoint",
      });
      const context = { subdomain: "api", version: "v1" };

      const result = resolveVariables(request, context);

      expect(result.url).toBe("https://api.example.com/v1/endpoint");
    });
  });
});
