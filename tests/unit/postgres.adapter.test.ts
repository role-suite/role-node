import { beforeEach, describe, expect, it, vi } from "vitest";

import { DbError } from "../../src/shared/errors/db-error.js";
import { createPostgresClient } from "../../src/shared/db/adapters/postgres.adapter.js";
import type { DatabaseConfig } from "../../src/types/db.js";

const { poolState, MockPool } = vi.hoisted(() => {
  const state = {
    poolConfig: undefined as unknown,
    query: vi.fn(),
    connect: vi.fn(),
    end: vi.fn(),
  };

  class LocalMockPool {
    public constructor(config: unknown) {
      state.poolConfig = config;
    }

    public query = state.query;
    public connect = state.connect;
    public end = state.end;
  }

  return { poolState: state, MockPool: LocalMockPool };
});

vi.mock("pg", () => ({
  Pool: MockPool,
}));

describe("postgres adapter", () => {
  const config: DatabaseConfig = {
    connectionString: "postgres://db-user:db-pass@localhost:5432/app",
    poolMin: 1,
    poolMax: 5,
    ssl: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    poolState.poolConfig = undefined;
  });

  it("creates pool with expected config", () => {
    createPostgresClient(config);

    expect(poolState.poolConfig).toEqual({
      connectionString: config.connectionString,
      min: 1,
      max: 5,
    });
  });

  it("runs query and normalizes result", async () => {
    poolState.query.mockResolvedValue({
      rows: [{ id: 1 }],
      rowCount: null,
    });

    const client = createPostgresClient(config);
    const result = await client.query("select 1", []);

    expect(result).toEqual({ rows: [{ id: 1 }], rowCount: 1 });
    expect(poolState.query).toHaveBeenCalledWith("select 1", []);
  });

  it("wraps query failures into DbError", async () => {
    poolState.query.mockRejectedValue(new Error("boom"));

    const client = createPostgresClient(config);

    await expect(client.query("select now()", [])).rejects.toBeInstanceOf(
      DbError,
    );
    await expect(client.query("select now()", [])).rejects.toMatchObject({
      message: "PostgreSQL query failed",
      dialect: "postgres",
    });
  });

  it("commits transaction on success", async () => {
    const txQuery = vi.fn();
    const release = vi.fn();

    txQuery.mockResolvedValueOnce(undefined);
    txQuery.mockResolvedValueOnce({ rows: [{ name: "ok" }], rowCount: 1 });
    txQuery.mockResolvedValueOnce(undefined);

    poolState.connect.mockResolvedValue({ query: txQuery, release });

    const client = createPostgresClient(config);
    const result = await client.transaction(async (tx) =>
      tx.query("select * from users", []),
    );

    expect(result).toEqual({ rows: [{ name: "ok" }], rowCount: 1 });
    expect(txQuery).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(txQuery).toHaveBeenNthCalledWith(2, "select * from users", []);
    expect(txQuery).toHaveBeenNthCalledWith(3, "COMMIT");
    expect(release).toHaveBeenCalledOnce();
  });

  it("rolls back transaction on failure", async () => {
    const txQuery = vi.fn();
    const release = vi.fn();

    txQuery.mockResolvedValueOnce(undefined);
    txQuery.mockResolvedValueOnce(undefined);

    poolState.connect.mockResolvedValue({ query: txQuery, release });

    const client = createPostgresClient(config);

    await expect(
      client.transaction(async () => {
        throw new Error("tx failed");
      }),
    ).rejects.toBeInstanceOf(DbError);

    expect(txQuery).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(txQuery).toHaveBeenNthCalledWith(2, "ROLLBACK");
    expect(release).toHaveBeenCalledOnce();
  });

  it("closes pool", async () => {
    poolState.end.mockResolvedValue(undefined);

    const client = createPostgresClient(config);
    await client.close();

    expect(poolState.end).toHaveBeenCalledOnce();
  });
});
