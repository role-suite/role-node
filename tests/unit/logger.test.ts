import { afterEach, describe, expect, it, vi } from "vitest";

const loadLogger = async (nodeEnv: "development" | "production") => {
  vi.resetModules();
  vi.doMock("../../src/config/env.js", () => ({
    env: {
      NODE_ENV: nodeEnv,
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
