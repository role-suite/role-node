import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DatabaseClient } from "../../src/types/db.js";

const { createPostgresClientMock } = vi.hoisted(() => ({
  createPostgresClientMock: vi.fn(),
}));

vi.mock("../../src/shared/db/postgres-client.js", () => ({
  createPostgresClient: createPostgresClientMock,
}));

const buildClient = (): DatabaseClient => ({
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
    createPostgresClientMock.mockReturnValue(client);

    vi.doMock("../../src/config/env.js", () => ({
      env: {
        DB_HOST: "localhost",
        DB_PORT: 6321,
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
    expect(createPostgresClientMock).toHaveBeenCalledOnce();
    expect(createPostgresClientMock).toHaveBeenCalledWith({
      host: "localhost",
      port: 6321,
      user: "db-user",
      password: "db-pass",
      database: "app",
      poolMin: 0,
      poolMax: 10,
      ssl: false,
    });
  });

  it("closes existing client and allows recreation", async () => {
    const firstClient = buildClient();
    const secondClient = buildClient();
    createPostgresClientMock
      .mockReturnValueOnce(firstClient)
      .mockReturnValueOnce(secondClient);

    vi.doMock("../../src/config/env.js", () => ({
      env: {
        DB_HOST: "localhost",
        DB_PORT: 6321,
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
    expect(createPostgresClientMock).toHaveBeenCalledTimes(2);
  });
});
