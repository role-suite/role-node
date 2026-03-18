import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DatabaseClient } from "../../src/types/db.js";

const { createDatabaseClientMock } = vi.hoisted(() => ({
  createDatabaseClientMock: vi.fn(),
}));

vi.mock("../../src/shared/db/client-factory.js", () => ({
  createDatabaseClient: createDatabaseClientMock,
}));

const buildClient = (): DatabaseClient => ({
  dialect: "postgres",
  query: vi.fn(),
  transaction: vi.fn(),
  close: vi.fn().mockResolvedValue(undefined),
});

describe("config db", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("creates db instance lazily and reuses singleton", async () => {
    const client = buildClient();
    createDatabaseClientMock.mockReturnValue(client);

    vi.doMock("../../src/config/env.js", () => ({
      env: {
        DB_DIALECT: "postgres",
        DATABASE_URL: "postgres://localhost:5432/app",
        DB_POOL_MIN: 0,
        DB_POOL_MAX: 10,
        DB_SSL: false,
      },
    }));

    const { getDb } = await import("../../src/config/db.js");
    const first = getDb();
    const second = getDb();

    expect(first).toBe(client);
    expect(second).toBe(client);
    expect(createDatabaseClientMock).toHaveBeenCalledOnce();
    expect(createDatabaseClientMock).toHaveBeenCalledWith("postgres", {
      connectionString: "postgres://localhost:5432/app",
      poolMin: 0,
      poolMax: 10,
      ssl: false,
    });
  });

  it("throws when DATABASE_URL is missing", async () => {
    vi.doMock("../../src/config/env.js", () => ({
      env: {
        DB_DIALECT: "postgres",
        DATABASE_URL: undefined,
        DB_POOL_MIN: 0,
        DB_POOL_MAX: 10,
        DB_SSL: false,
      },
    }));

    const { getDb } = await import("../../src/config/db.js");

    expect(() => getDb()).toThrowError(
      "DATABASE_URL is required to initialize a database client",
    );
    expect(createDatabaseClientMock).not.toHaveBeenCalled();
  });

  it("closes existing client and allows recreation", async () => {
    const firstClient = buildClient();
    const secondClient = buildClient();
    createDatabaseClientMock
      .mockReturnValueOnce(firstClient)
      .mockReturnValueOnce(secondClient);

    vi.doMock("../../src/config/env.js", () => ({
      env: {
        DB_DIALECT: "mysql",
        DATABASE_URL: "mysql://localhost:3306/app",
        DB_POOL_MIN: 0,
        DB_POOL_MAX: 4,
        DB_SSL: true,
      },
    }));

    const { closeDb, getDb } = await import("../../src/config/db.js");

    const first = getDb();
    await closeDb();
    const second = getDb();

    expect(first).toBe(firstClient);
    expect(firstClient.close).toHaveBeenCalledOnce();
    expect(second).toBe(secondClient);
    expect(createDatabaseClientMock).toHaveBeenCalledTimes(2);
  });
});
