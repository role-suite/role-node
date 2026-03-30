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
        DB_HOST: "localhost",
        DB_PORT: 5432,
        DB_USER: "db-user",
        DB_PASSWORD: "db-pass",
        DB_NAME: "app",
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
      host: "localhost",
      port: 5432,
      user: "db-user",
      password: "db-pass",
      database: "app",
      poolMin: 0,
      poolMax: 10,
      ssl: false,
    });
  });

  it("creates config for mysql dialect", async () => {
    vi.doMock("../../src/config/env.js", () => ({
      env: {
        DB_DIALECT: "mysql",
        DB_HOST: "mysql.internal",
        DB_PORT: 3306,
        DB_USER: "mysql-user",
        DB_PASSWORD: "mysql-pass",
        DB_NAME: "role_node",
        DB_POOL_MIN: 0,
        DB_POOL_MAX: 4,
        DB_SSL: true,
      },
    }));

    const { getDb } = await import("../../src/config/db.js");

    getDb();

    expect(createDatabaseClientMock).toHaveBeenCalledWith("mysql", {
      host: "mysql.internal",
      port: 3306,
      user: "mysql-user",
      password: "mysql-pass",
      database: "role_node",
      poolMin: 0,
      poolMax: 4,
      ssl: true,
    });
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
        DB_HOST: "localhost",
        DB_PORT: 3306,
        DB_USER: "db-user",
        DB_PASSWORD: "db-pass",
        DB_NAME: "app",
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
