import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DatabaseClient, DatabaseConfig } from "../../src/types/db.js";

const { createMysqlClientMock, createPostgresClientMock } = vi.hoisted(() => ({
  createMysqlClientMock: vi.fn(),
  createPostgresClientMock: vi.fn(),
}));

vi.mock("../../src/shared/db/adapters/mysql.adapter.js", () => ({
  createMysqlClient: createMysqlClientMock,
}));

vi.mock("../../src/shared/db/adapters/postgres.adapter.js", () => ({
  createPostgresClient: createPostgresClientMock,
}));

import { createDatabaseClient } from "../../src/shared/db/client-factory.js";

const baseConfig: DatabaseConfig = {
  connectionString: "postgres://localhost:5432/app",
  poolMin: 0,
  poolMax: 10,
  ssl: false,
};

const fakeClient: DatabaseClient = {
  dialect: "postgres",
  query: vi.fn(),
  transaction: vi.fn(),
  close: vi.fn(),
};

describe("database client factory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createPostgresClientMock.mockReturnValue(fakeClient);
    createMysqlClientMock.mockReturnValue(fakeClient);
  });

  it("creates postgres client", () => {
    const client = createDatabaseClient("postgres", baseConfig);

    expect(client).toBe(fakeClient);
    expect(createPostgresClientMock).toHaveBeenCalledWith(baseConfig);
    expect(createMysqlClientMock).not.toHaveBeenCalled();
  });

  it("creates mysql client for mysql dialect", () => {
    const client = createDatabaseClient("mysql", baseConfig);

    expect(client).toBe(fakeClient);
    expect(createMysqlClientMock).toHaveBeenCalledWith(baseConfig, "mysql");
  });

  it("creates mysql client for mariadb dialect", () => {
    const client = createDatabaseClient("mariadb", baseConfig);

    expect(client).toBe(fakeClient);
    expect(createMysqlClientMock).toHaveBeenCalledWith(baseConfig, "mariadb");
  });

  it("throws for unsupported dialect values", () => {
    expect(() =>
      createDatabaseClient("sqlite" as never, baseConfig),
    ).toThrowError("Unsupported database dialect: sqlite");
  });
});
