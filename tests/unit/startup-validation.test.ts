import { beforeEach, describe, expect, it, vi } from "vitest";

describe("startup validation", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("passes when env and database connectivity are valid", async () => {
    const query = vi
      .fn()
      .mockResolvedValue({ rows: [{ one: 1 }], rowCount: 1 });
    const loggerInfo = vi.fn();

    vi.doMock("../../src/config/env.js", () => ({
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        DB_DIALECT: "postgres",
        DATABASE_URL: "postgres://db-user:db-pass@localhost:5432/app",
        DB_POOL_MIN: 0,
        DB_POOL_MAX: 10,
        DB_SSL: false,
      },
    }));

    vi.doMock("../../src/config/db.js", () => ({
      getDb: () => ({
        query,
      }),
    }));

    vi.doMock("../../src/shared/logger.js", () => ({
      logger: {
        info: loggerInfo,
      },
    }));

    const { validateStartupOrThrow } =
      await import("../../src/config/startup-validation.js");

    await expect(validateStartupOrThrow()).resolves.toBeUndefined();
    expect(query).toHaveBeenCalledWith("SELECT 1");
    expect(loggerInfo).toHaveBeenCalledWith(
      "Startup validation passed",
      expect.objectContaining({ dbDialect: "postgres", dbHost: "localhost" }),
    );
  });

  it("fails when DATABASE_URL is missing", async () => {
    vi.doMock("../../src/config/env.js", () => ({
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        DB_DIALECT: "postgres",
        DATABASE_URL: undefined,
        DB_POOL_MIN: 0,
        DB_POOL_MAX: 10,
        DB_SSL: false,
      },
    }));

    vi.doMock("../../src/config/db.js", () => ({
      getDb: () => ({
        query: vi.fn(),
      }),
    }));

    vi.doMock("../../src/shared/logger.js", () => ({
      logger: {
        info: vi.fn(),
      },
    }));

    const { validateStartupOrThrow } =
      await import("../../src/config/startup-validation.js");

    await expect(validateStartupOrThrow()).rejects.toThrowError(
      "DATABASE_URL is required for startup validation",
    );
  });

  it("fails when DATABASE_URL protocol does not match dialect", async () => {
    vi.doMock("../../src/config/env.js", () => ({
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        DB_DIALECT: "mysql",
        DATABASE_URL: "postgres://db-user:db-pass@localhost:5432/app",
        DB_POOL_MIN: 0,
        DB_POOL_MAX: 10,
        DB_SSL: false,
      },
    }));

    vi.doMock("../../src/config/db.js", () => ({
      getDb: () => ({
        query: vi.fn(),
      }),
    }));

    vi.doMock("../../src/shared/logger.js", () => ({
      logger: {
        info: vi.fn(),
      },
    }));

    const { validateStartupOrThrow } =
      await import("../../src/config/startup-validation.js");

    await expect(validateStartupOrThrow()).rejects.toThrowError(
      'DATABASE_URL protocol "postgres:" does not match DB_DIALECT "mysql"',
    );
  });

  it("fails when connectivity check fails", async () => {
    const query = vi.fn().mockRejectedValue(new Error("connection refused"));

    vi.doMock("../../src/config/env.js", () => ({
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        DB_DIALECT: "postgres",
        DATABASE_URL: "postgres://db-user:db-pass@localhost:5432/app",
        DB_POOL_MIN: 0,
        DB_POOL_MAX: 10,
        DB_SSL: true,
      },
    }));

    vi.doMock("../../src/config/db.js", () => ({
      getDb: () => ({
        query,
      }),
    }));

    vi.doMock("../../src/shared/logger.js", () => ({
      logger: {
        info: vi.fn(),
      },
    }));

    const { validateStartupOrThrow } =
      await import("../../src/config/startup-validation.js");

    await expect(validateStartupOrThrow()).rejects.toThrowError(
      "Database connectivity check failed",
    );
    expect(query).toHaveBeenCalledWith("SELECT 1");
  });
});
