import { afterEach, describe, expect, it, vi } from "vitest";

const originalNodeEnv = process.env.NODE_ENV;

const loadProductionLogger = async () => {
  vi.resetModules();
  process.env.NODE_ENV = "production";
  return import("../../src/shared/logger.js");
};

describe("telemetry redaction integration", () => {
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("does not emit raw secret values in production logs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { logger } = await loadProductionLogger();

    logger.info("sensitive-test", {
      password: "my-password",
      accessToken: "my-access-token",
      nested: {
        apiKey: "my-api-key",
      },
    });

    const serialized = logSpy.mock.calls
      .map((call) => String(call[0]))
      .find((entry) => {
        try {
          const parsed = JSON.parse(entry) as { message?: string };
          return parsed.message === "sensitive-test";
        } catch {
          return false;
        }
      });

    expect(serialized).toBeDefined();
    const logEntry = String(serialized);
    expect(logEntry).not.toContain("my-password");
    expect(logEntry).not.toContain("my-access-token");
    expect(logEntry).not.toContain("my-api-key");
    expect(logEntry).toContain("[REDACTED]");
  });
});
