import { EventEmitter } from "node:events";

import { afterEach, describe, expect, it, vi } from "vitest";

import { logger } from "../../src/shared/logger.js";
import { requestLogger } from "../../src/shared/middleware/request-logger.js";

class MockResponse extends EventEmitter {
  public statusCode = 200;
  public locals: Record<string, unknown> = {};
  private readonly headers = new Map<string, string>();

  public setHeader(name: string, value: string): void {
    this.headers.set(name.toLowerCase(), value);
  }

  public getHeader(name: string): string | undefined {
    return this.headers.get(name.toLowerCase());
  }
}

describe("request logger middleware", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reuses incoming request id and logs completion", () => {
    const infoSpy = vi
      .spyOn(logger, "info")
      .mockImplementation(() => undefined);
    const warnSpy = vi
      .spyOn(logger, "warn")
      .mockImplementation(() => undefined);
    const next = vi.fn();
    const response = new MockResponse();

    const request = {
      method: "GET",
      originalUrl: "/health",
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" },
      header: (name: string) =>
        name.toLowerCase() === "x-request-id" ? "incoming-id" : undefined,
    };

    requestLogger(request as never, response as never, next);

    expect(next).toHaveBeenCalledOnce();
    expect(response.getHeader("x-request-id")).toBe("incoming-id");
    expect(response.locals.requestId).toBe("incoming-id");

    response.emit("finish");

    expect(infoSpy).toHaveBeenCalledWith(
      "HTTP request completed",
      expect.objectContaining({
        requestId: "incoming-id",
        method: "GET",
        path: "/health",
        statusCode: 200,
        durationMs: expect.any(Number),
        ip: "127.0.0.1",
      }),
    );
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("generates request id when header is missing", () => {
    const infoSpy = vi
      .spyOn(logger, "info")
      .mockImplementation(() => undefined);
    const next = vi.fn();
    const response = new MockResponse();

    const request = {
      method: "POST",
      originalUrl: "/api/users",
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" },
      header: () => undefined,
    };

    requestLogger(request as never, response as never, next);
    response.emit("finish");

    const requestId = String(response.getHeader("x-request-id"));
    expect(requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(infoSpy).toHaveBeenCalledWith(
      "HTTP request completed",
      expect.objectContaining({
        requestId,
        method: "POST",
        path: "/api/users",
        ip: "127.0.0.1",
      }),
    );
  });

  it("logs warning when request closes before completion", () => {
    const infoSpy = vi
      .spyOn(logger, "info")
      .mockImplementation(() => undefined);
    const warnSpy = vi
      .spyOn(logger, "warn")
      .mockImplementation(() => undefined);
    const next = vi.fn();
    const response = new MockResponse();

    const request = {
      method: "GET",
      originalUrl: "/api/users",
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" },
      header: (name: string) =>
        name.toLowerCase() === "x-request-id" ? "closed-id" : undefined,
    };

    requestLogger(request as never, response as never, next);
    response.emit("close");

    expect(warnSpy).toHaveBeenCalledWith(
      "HTTP request closed before completion",
      expect.objectContaining({
        requestId: "closed-id",
        method: "GET",
        path: "/api/users",
        ip: "127.0.0.1",
      }),
    );
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it("normalizes loopback IPv6 into IPv4 representation", () => {
    const infoSpy = vi
      .spyOn(logger, "info")
      .mockImplementation(() => undefined);
    const next = vi.fn();
    const response = new MockResponse();

    const request = {
      method: "GET",
      originalUrl: "/health",
      ip: "::1",
      socket: { remoteAddress: "::1" },
      header: () => undefined,
    };

    requestLogger(request as never, response as never, next);
    response.emit("finish");

    expect(infoSpy).toHaveBeenCalledWith(
      "HTTP request completed",
      expect.objectContaining({
        ip: "127.0.0.1",
      }),
    );
  });

  it("prefers forwarded client IP when available", () => {
    const infoSpy = vi
      .spyOn(logger, "info")
      .mockImplementation(() => undefined);
    const next = vi.fn();
    const response = new MockResponse();

    const request = {
      method: "GET",
      originalUrl: "/health",
      ip: "::1",
      socket: { remoteAddress: "::1" },
      header: (name: string) => {
        if (name.toLowerCase() === "x-forwarded-for") {
          return "192.168.1.25, 10.0.0.2";
        }

        return undefined;
      },
    };

    requestLogger(request as never, response as never, next);
    response.emit("finish");

    expect(infoSpy).toHaveBeenCalledWith(
      "HTTP request completed",
      expect.objectContaining({
        ip: "192.168.1.25",
      }),
    );
  });
});
