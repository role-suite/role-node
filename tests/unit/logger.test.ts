import { afterEach, describe, expect, it, vi } from "vitest";

const loadLogger = async (
  nodeEnv: "development" | "production",
  traceContext?: { traceId: string; spanId: string },
) => {
  vi.resetModules();
  vi.doMock("../../src/config/env.js", () => ({
    env: {
      NODE_ENV: nodeEnv,
    },
  }));
  vi.doMock("@opentelemetry/api", () => ({
    trace: {
      getActiveSpan: () =>
        traceContext
          ? {
              spanContext: () => traceContext,
            }
          : undefined,
    },
  }));

  return import("../../src/shared/logger.js");
};

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("writes readable logs in development mode", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger("development");

    logger.info("test-info", { value: 1 });

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy.mock.calls[0][0]).toContain("INFO test-info");
    expect(logSpy.mock.calls[0][1]).toEqual({ value: 1 });
  });

  it("serializes production logs as json", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger("production");

    logger.info("prod-info", { requestId: "abc" });

    expect(logSpy).toHaveBeenCalledOnce();
    const payload = JSON.parse(String(logSpy.mock.calls[0][0])) as {
      level: string;
      message: string;
      env: string;
      payload: { requestId: string };
    };

    expect(payload.level).toBe("info");
    expect(payload.message).toBe("prod-info");
    expect(payload.env).toBe("production");
    expect(payload.payload.requestId).toBe("abc");
  });

  it("redacts sensitive fields in production payload", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger("production");

    logger.info("prod-sensitive", {
      password: "plain",
      nested: { accessToken: "raw-token" },
    });

    const payload = JSON.parse(String(logSpy.mock.calls[0][0])) as {
      payload: {
        password: string;
        nested: { accessToken: string };
      };
    };

    expect(payload.payload.password).toBe("[REDACTED]");
    expect(payload.payload.nested.accessToken).toBe("[REDACTED]");
  });

  it("includes request id from request context in production logs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const [{ logger }, { runWithRequestContext }] = await Promise.all([
      loadLogger("production"),
      import("../../src/shared/request-context.js"),
    ]);

    runWithRequestContext("ctx-req-id", () => {
      logger.info("contextual-log", { feature: "test" });
    });

    expect(logSpy).toHaveBeenCalledOnce();
    const payload = JSON.parse(String(logSpy.mock.calls[0][0])) as {
      requestId?: string;
    };

    expect(payload.requestId).toBe("ctx-req-id");
  });

  it("includes trace and span ids in production logs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger("production", {
      traceId: "trace-123",
      spanId: "span-abc",
    });

    logger.info("traced-log", { feature: "trace-test" });

    expect(logSpy).toHaveBeenCalledOnce();
    const payload = JSON.parse(String(logSpy.mock.calls[0][0])) as {
      traceId?: string;
      spanId?: string;
    };

    expect(payload.traceId).toBe("trace-123");
    expect(payload.spanId).toBe("span-abc");
  });

  it("includes request id in development log prefix", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const [{ logger }, { runWithRequestContext }] = await Promise.all([
      loadLogger("development"),
      import("../../src/shared/request-context.js"),
    ]);

    runWithRequestContext("ctx-dev-id", () => {
      logger.info("dev-context", { feature: "test" });
    });

    expect(logSpy).toHaveBeenCalledOnce();
    expect(String(logSpy.mock.calls[0][0])).toContain("requestId=ctx-dev-id");
  });

  it("includes trace and span ids in development log prefix", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger("development", {
      traceId: "trace-dev-1",
      spanId: "span-dev-1",
    });

    logger.info("dev-traced", { feature: "trace-test" });

    expect(logSpy).toHaveBeenCalledOnce();
    expect(String(logSpy.mock.calls[0][0])).toContain("traceId=trace-dev-1");
    expect(String(logSpy.mock.calls[0][0])).toContain("spanId=span-dev-1");
  });

  it("redacts sensitive fields in development payload", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger("development");

    logger.info("dev-sensitive", {
      refreshToken: "raw-refresh",
      inner: { authorization: "Bearer raw" },
    });

    expect(logSpy.mock.calls[0][1]).toEqual({
      refreshToken: "[REDACTED]",
      inner: { authorization: "[REDACTED]" },
    });
  });

  it("handles circular payloads safely in production logs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger("production");
    const payload: Record<string, unknown> = {
      accessToken: "raw-token",
    };
    payload.self = payload;

    logger.info("prod-circular", payload);

    const serialized = String(logSpy.mock.calls[0][0]);
    expect(serialized).toContain("[REDACTED]");
    expect(serialized).toContain("[Circular]");
    expect(serialized).not.toContain("raw-token");
  });

  it("writes errors to console.error and normalizes Error payload", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const { logger } = await loadLogger("development");

    logger.error("test-error", new Error("boom"));

    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy.mock.calls[0][0]).toContain("ERROR test-error");
    expect(errorSpy.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        name: "Error",
        message: "boom",
      }),
    );
  });

  it("writes warn message without payload in development", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger("development");

    logger.warn("warn-only");

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy.mock.calls[0][0]).toContain("WARN warn-only");
    expect(logSpy.mock.calls[0]).toHaveLength(1);
  });

  it("writes error message without payload in development", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const { logger } = await loadLogger("development");

    logger.error("error-only");

    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy.mock.calls[0][0]).toContain("ERROR error-only");
    expect(errorSpy.mock.calls[0]).toHaveLength(1);
  });

  it("writes error logs to console.error in production json mode", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const { logger } = await loadLogger("production");

    logger.error("prod-error", { code: "E_FAIL" });

    expect(errorSpy).toHaveBeenCalledOnce();
    const payload = JSON.parse(String(errorSpy.mock.calls[0][0])) as {
      level: string;
      message: string;
      payload: { code: string };
    };

    expect(payload.level).toBe("error");
    expect(payload.message).toBe("prod-error");
    expect(payload.payload.code).toBe("E_FAIL");
  });

  it("does not emit debug logs in production", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadLogger("production");

    logger.debug("debug-hidden", { key: 1 });

    expect(logSpy).not.toHaveBeenCalled();
  });
});
