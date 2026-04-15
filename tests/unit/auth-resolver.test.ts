import { describe, expect, it } from "vitest";

import { resolveAuth } from "../../src/internal/runner/planning/auth-resolver.js";
import type { HttpRequestDraft } from "../../src/internal/runner/core/types.js";

const createRequest = (
  auth: HttpRequestDraft["auth"],
  headers?: HttpRequestDraft["headers"],
): HttpRequestDraft => ({
  method: "GET",
  url: "https://api.example.com/data",
  headers: headers ?? [],
  auth,
});

describe("authResolver", () => {
  it("returns request unchanged when auth type is none", () => {
    const request = createRequest({ type: "none" });

    const result = resolveAuth(request);

    expect(result.auth).toEqual({ type: "none" });
    expect(result.headers).toHaveLength(0);
  });

  it("adds bearer token header when auth type is bearer", () => {
    const request = createRequest({
      type: "bearer",
      token: "my-token",
    });

    const result = resolveAuth(request);

    expect(result.headers).toHaveLength(1);
    expect(result.headers[0]).toEqual({
      key: "Authorization",
      value: "Bearer my-token",
      enabled: true,
    });
  });

  it("adds basic auth header when auth type is basic", () => {
    const request = createRequest({
      type: "basic",
      username: "user",
      password: "pass",
    });

    const result = resolveAuth(request);

    expect(result.headers).toHaveLength(1);
    expect(result.headers[0].key).toBe("Authorization");
    expect(result.headers[0].value).toMatch(/^Basic /);
  });

  it("does not add header when authorization already exists", () => {
    const request = createRequest({ type: "bearer", token: "new-token" }, [
      { key: "Authorization", value: "Existing", enabled: true },
    ]);

    const result = resolveAuth(request);

    expect(result.headers).toHaveLength(1);
    expect(result.headers[0].value).toBe("Existing");
  });

  it("does not add header when authorization is disabled", () => {
    const request = createRequest({ type: "bearer", token: "new-token" }, [
      { key: "Authorization", value: "Existing", enabled: false },
    ]);

    const result = resolveAuth(request);

    expect(result.headers).toHaveLength(2);
    expect(result.headers[1].value).toBe("Bearer new-token");
  });

  it("preserves existing headers when adding auth", () => {
    const request = createRequest({ type: "bearer", token: "my-token" }, [
      { key: "Content-Type", value: "application/json", enabled: true },
      { key: "X-Custom", value: "value", enabled: true },
    ]);

    const result = resolveAuth(request);

    expect(result.headers).toHaveLength(3);
    expect(result.headers[0].key).toBe("Content-Type");
    expect(result.headers[1].key).toBe("X-Custom");
  });

  it("preserves existing headers when adding auth", () => {
    const request = createRequest({ type: "bearer", token: "my-token" }, [
      { key: "Content-Type", value: "application/json", enabled: true },
      { key: "X-Custom", value: "value", enabled: true },
    ]);

    const result = resolveAuth(request);

    expect(result.headers).toHaveLength(3);
    expect(result.headers[2].key).toBe("Authorization");
  });

  it("is case insensitive when checking authorization header", () => {
    const request = createRequest({ type: "bearer", token: "token" }, [
      { key: "AUTHORIZATION", value: "Existing", enabled: true },
    ]);

    const result = resolveAuth(request);

    expect(result.headers).toHaveLength(1);
    expect(result.headers[0].value).toBe("Existing");
  });
});
