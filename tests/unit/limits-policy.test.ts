import { describe, expect, it } from "vitest";

import type { RequestRunnerEngineConfig } from "../../src/internal/runner/config/engine-config.js";
import {
  assertRequestLimits,
  resolveRunOptions,
} from "../../src/internal/runner/policy/limits-policy.js";
import type { HttpRequestDraft } from "../../src/internal/runner/core/types.js";

const createConfig = (
  overrides?: Partial<RequestRunnerEngineConfig>,
): RequestRunnerEngineConfig => ({
  persistence: { retentionDays: 7, persistBinaryBodies: true },
  network: { assertNetwork: false, maxResponseSizeBytes: 10 * 1024 * 1024 },
  limits: {
    maxReqDurationMs: 30_000,
    maxConcurrentRequests: 100,
    timeoutMsMax: 60_000,
    timeoutMsDefault: 30_000,
    maxRequestBytes: 1024 * 1024,
    maxResponseBytesDefault: 5 * 1024 * 1024,
    maxResponseBytesMax: 50 * 1024 * 1024,
  },
  execution: { followRedirectsDefault: true, maxRedirects: 5 },
  runner: { engine: "undici", engineOptions: {} },
  ...overrides,
});

describe("limitsPolicy", () => {
  describe("resolveRunOptions", () => {
    it("uses defaults when no options provided", () => {
      const config = createConfig();
      const options = resolveRunOptions(undefined, config);

      expect(options.timeoutMs).toBe(30_000);
      expect(options.followRedirects).toBe(true);
      expect(options.maxResponseBytes).toBe(5 * 1024 * 1024);
    });

    it("uses provided values when specified", () => {
      const config = createConfig();
      const options = resolveRunOptions(
        { timeoutMs: 10_000, followRedirects: false, maxResponseBytes: 1024 },
        config,
      );

      expect(options.timeoutMs).toBe(10_000);
      expect(options.followRedirects).toBe(false);
      expect(options.maxResponseBytes).toBe(1024);
    });

    it("throws when timeoutMs exceeds max", () => {
      const config = createConfig({ limits: { timeoutMsMax: 60_000 } });

      expect(() => resolveRunOptions({ timeoutMs: 70_000 }, config)).toThrow(
        "timeoutMs exceeds configured maximum",
      );
    });

    it("throws when timeoutMs is zero", () => {
      const config = createConfig();

      expect(() => resolveRunOptions({ timeoutMs: 0 }, config)).toThrow(
        "Invalid run option values",
      );
    });

    it("throws when timeoutMs is negative", () => {
      const config = createConfig();

      expect(() => resolveRunOptions({ timeoutMs: -1 }, config)).toThrow(
        "Invalid run option values",
      );
    });

    it("throws when maxResponseBytes is zero", () => {
      const config = createConfig();

      expect(() => resolveRunOptions({ maxResponseBytes: 0 }, config)).toThrow(
        "Invalid run option values",
      );
    });

    it("throws when maxResponseBytes is negative", () => {
      const config = createConfig();

      expect(() => resolveRunOptions({ maxResponseBytes: -1 }, config)).toThrow(
        "Invalid run option values",
      );
    });

    it("includes maxRedirects in result", () => {
      const config = createConfig();
      const options = resolveRunOptions(undefined, config);

      expect(options.maxRedirects).toBe(5);
    });
  });

  describe("assertRequestLimits", () => {
    it("allows request with no body", () => {
      const config = createConfig();
      const request: HttpRequestDraft = {
        method: "GET",
        url: "https://api.example.com",
        headers: {},
        body: { mode: "none" },
      };

      expect(() => assertRequestLimits(request, config)).not.toThrow();
    });

    it("allows raw body under limit", () => {
      const config = createConfig();
      const request: HttpRequestDraft = {
        method: "POST",
        url: "https://api.example.com",
        headers: {},
        body: { mode: "raw", raw: "hello world" },
      };

      expect(() => assertRequestLimits(request, config)).not.toThrow();
    });

    it("throws when raw body exceeds limit", () => {
      const config = createConfig({ limits: { maxRequestBytes: 5 } });
      const request: HttpRequestDraft = {
        method: "POST",
        url: "https://api.example.com",
        headers: {},
        body: { mode: "raw", raw: "1234567" },
      };

      expect(() => assertRequestLimits(request, config)).toThrow(
        "Request body exceeds configured maximum",
      );
    });

    it("allows urlencoded body under limit", () => {
      const config = createConfig({ limits: { maxRequestBytes: 100 } });
      const request: HttpRequestDraft = {
        method: "POST",
        url: "https://api.example.com",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: { mode: "urlencoded", entries: [{ key: "key", value: "value" }] },
      };

      expect(() => assertRequestLimits(request, config)).not.toThrow();
    });

    it("allows formdata text entries under limit", () => {
      const config = createConfig({ limits: { maxRequestBytes: 100 } });
      const request: HttpRequestDraft = {
        method: "POST",
        url: "https://api.example.com",
        headers: { "Content-Type": "multipart/form-data" },
        body: {
          mode: "formdata",
          entries: [{ type: "text", key: "field", value: "test" }],
        },
      };

      expect(() => assertRequestLimits(request, config)).not.toThrow();
    });

    it("allows formdata file entries under limit", () => {
      const config = createConfig({ limits: { maxRequestBytes: 100 } });
      const request: HttpRequestDraft = {
        method: "POST",
        url: "https://api.example.com",
        headers: { "Content-Type": "multipart/form-data" },
        body: {
          mode: "formdata",
          entries: [
            {
              type: "file",
              key: "file",
              dataBase64: "SGVsbG8=",
              fileName: "test.txt",
            },
          ],
        },
      };

      expect(() => assertRequestLimits(request, config)).not.toThrow();
    });

    it("allows binary body under limit", () => {
      const config = createConfig({ limits: { maxRequestBytes: 100 } });
      const request: HttpRequestDraft = {
        method: "POST",
        url: "https://api.example.com",
        headers: {},
        body: { mode: "binary", fileName: "test.txt", dataBase64: "SGVsbG8=" },
      };

      expect(() => assertRequestLimits(request, config)).not.toThrow();
    });

    it("throws when urlencoded body string exceeds limit", () => {
      const config = createConfig({ limits: { maxRequestBytes: 5 } });
      const request: HttpRequestDraft = {
        method: "POST",
        url: "https://api.example.com",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: {
          mode: "urlencoded",
          entries: [{ key: "key", value: "value12345" }],
        },
      };

      expect(() => assertRequestLimits(request, config)).toThrow();
    });
  });
});
