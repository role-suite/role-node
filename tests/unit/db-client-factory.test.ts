import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DatabaseClient, DatabaseConfig } from "../../src/types/db.js";

const { createPostgresClientMock } = vi.hoisted(() => ({
  createPostgresClientMock: vi.fn(),
}));

vi.mock("../../src/shared/db/adapters/postgres.adapter.js", () => ({
  createPostgresClient: createPostgresClientMock,
}));

import { createDatabaseClient } from "../../src/shared/db/client-factory.js";

const baseConfig: DatabaseConfig = {
  host: "localhost",
  port: 5432,
  user: "db-user",
  password: "db-pass",
  database: "app",
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
  });

  it("creates postgres client", () => {
    const client = createDatabaseClient(baseConfig);

    expect(client).toBe(fakeClient);
    expect(createPostgresClientMock).toHaveBeenCalledWith(baseConfig);
  });
});
