import { describe, expect, it, vi } from "vitest";

import { securityHeaders } from "../../src/shared/middleware/security-headers.js";

class MockResponse {
  private readonly headers = new Map<string, string>();

  public setHeader(name: string, value: string): void {
    this.headers.set(name.toLowerCase(), value);
  }

  public getHeader(name: string): string | undefined {
    return this.headers.get(name.toLowerCase());
  }
}

describe("security headers middleware", () => {
  it("sets baseline security headers without HSTS over plain HTTP", () => {
    const next = vi.fn();
    const response = new MockResponse();
    const request = {
      secure: false,
      header: () => undefined,
    };

    securityHeaders(request as never, response as never, next);

    expect(next).toHaveBeenCalledOnce();
    expect(response.getHeader("x-content-type-options")).toBe("nosniff");
    expect(response.getHeader("x-frame-options")).toBe("DENY");
    expect(response.getHeader("strict-transport-security")).toBeUndefined();
  });

  it("sets HSTS when the request is secure", () => {
    const next = vi.fn();
    const response = new MockResponse();
    const request = {
      secure: true,
      header: () => undefined,
    };

    securityHeaders(request as never, response as never, next);

    expect(response.getHeader("strict-transport-security")).toBe(
      "max-age=15552000; includeSubDomains",
    );
  });

  it("sets HSTS when forwarded from a TLS-terminating proxy", () => {
    const next = vi.fn();
    const response = new MockResponse();
    const request = {
      secure: false,
      header: (name: string) =>
        name.toLowerCase() === "x-forwarded-proto" ? "https" : undefined,
    };

    securityHeaders(request as never, response as never, next);

    expect(response.getHeader("strict-transport-security")).toBe(
      "max-age=15552000; includeSubDomains",
    );
  });
});
