import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMysqlClient } from "../../src/shared/db/adapters/mysql.adapter.js";
import { DbError } from "../../src/shared/errors/db-error.js";
import type { DatabaseConfig } from "../../src/types/db.js";

const { mysqlState } = vi.hoisted(() => ({
  mysqlState: {
    options: undefined as unknown,
    execute: vi.fn(),
    getConnection: vi.fn(),
    end: vi.fn(),
  },
}));

vi.mock("mysql2/promise", () => ({
  default: {
    createPool: (options: unknown) => {
      mysqlState.options = options;

      return {
        execute: mysqlState.execute,
        getConnection: mysqlState.getConnection,
        end: mysqlState.end,
      };
    },
  },
}));

describe("mysql adapter", () => {
  const config: DatabaseConfig = {
    connectionString: "mysql://db-user:db-pass@localhost:3306/app",
    poolMin: 0,
    poolMax: 10,
    ssl: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mysqlState.options = undefined;
  });

  it("creates pool with expected options", () => {
    createMysqlClient(config, "mysql");

    expect(mysqlState.options).toEqual({
      uri: config.connectionString,
      connectionLimit: 10,
    });
  });

  it("adds ssl option when enabled", () => {
    createMysqlClient({ ...config, ssl: true }, "mysql");

    expect(mysqlState.options).toEqual({
      uri: config.connectionString,
      connectionLimit: 10,
      ssl: {},
    });
  });

  it("runs query and returns rows for select statements", async () => {
    mysqlState.execute.mockResolvedValue([[{ id: 7 }], []]);

    const client = createMysqlClient(config, "mysql");
    const result = await client.query("select * from users", []);

    expect(result).toEqual({ rows: [{ id: 7 }], rowCount: 1 });
    expect(mysqlState.execute).toHaveBeenCalledWith("select * from users", []);
  });

  it("returns affected row count for write statements", async () => {
    mysqlState.execute.mockResolvedValue([{ affectedRows: 2 }, []]);

    const client = createMysqlClient(config, "mariadb");
    const result = await client.query("update users set name = ?", ["x"]);

    expect(result).toEqual({ rows: [], rowCount: 2 });
  });

  it("wraps query failures into DbError", async () => {
    mysqlState.execute.mockRejectedValue(new Error("driver failed"));

    const client = createMysqlClient(config, "mysql");

    await expect(client.query("select now()", [])).rejects.toBeInstanceOf(
      DbError,
    );
    await expect(client.query("select now()", [])).rejects.toMatchObject({
      message: "mysql query failed",
      dialect: "mysql",
    });
  });

  it("commits transaction on success", async () => {
    const execute = vi.fn().mockResolvedValue([[{ id: 1 }], []]);
    const beginTransaction = vi.fn().mockResolvedValue(undefined);
    const commit = vi.fn().mockResolvedValue(undefined);
    const rollback = vi.fn().mockResolvedValue(undefined);
    const release = vi.fn();

    mysqlState.getConnection.mockResolvedValue({
      execute,
      beginTransaction,
      commit,
      rollback,
      release,
    });

    const client = createMysqlClient(config, "mysql");
    const result = await client.transaction(async (tx) => {
      await tx.transaction(async (innerTx) => {
        await innerTx.close();
        return undefined;
      });

      return tx.query("select 1", []);
    });

    expect(result).toEqual({ rows: [{ id: 1 }], rowCount: 1 });
    expect(beginTransaction).toHaveBeenCalledOnce();
    expect(commit).toHaveBeenCalledOnce();
    expect(rollback).not.toHaveBeenCalled();
    expect(release).toHaveBeenCalledOnce();
  });

  it("wraps transaction client query failures", async () => {
    const execute = vi.fn().mockRejectedValue(new Error("tx query failed"));
    const beginTransaction = vi.fn().mockResolvedValue(undefined);
    const commit = vi.fn().mockResolvedValue(undefined);
    const rollback = vi.fn().mockResolvedValue(undefined);
    const release = vi.fn();

    mysqlState.getConnection.mockResolvedValue({
      execute,
      beginTransaction,
      commit,
      rollback,
      release,
    });

    const client = createMysqlClient(config, "mysql");

    await expect(
      client.transaction(async (tx) => tx.query("select 1", [])),
    ).rejects.toMatchObject({
      message: "mysql transaction query failed",
      dialect: "mysql",
    });
  });

  it("rolls back transaction on failure", async () => {
    const beginTransaction = vi.fn().mockResolvedValue(undefined);
    const commit = vi.fn().mockResolvedValue(undefined);
    const rollback = vi.fn().mockResolvedValue(undefined);
    const release = vi.fn();

    mysqlState.getConnection.mockResolvedValue({
      execute: vi.fn(),
      beginTransaction,
      commit,
      rollback,
      release,
    });

    const client = createMysqlClient(config, "mysql");

    await expect(
      client.transaction(async () => {
        throw new Error("tx failed");
      }),
    ).rejects.toBeInstanceOf(DbError);

    expect(commit).not.toHaveBeenCalled();
    expect(rollback).toHaveBeenCalledOnce();
    expect(release).toHaveBeenCalledOnce();
  });

  it("rethrows DbError from transaction callback", async () => {
    const beginTransaction = vi.fn().mockResolvedValue(undefined);
    const commit = vi.fn().mockResolvedValue(undefined);
    const rollback = vi.fn().mockResolvedValue(undefined);
    const release = vi.fn();

    mysqlState.getConnection.mockResolvedValue({
      execute: vi.fn(),
      beginTransaction,
      commit,
      rollback,
      release,
    });

    const client = createMysqlClient(config, "mysql");
    const dbError = new DbError("custom db error", { dialect: "mysql" });

    await expect(
      client.transaction(async () => {
        throw dbError;
      }),
    ).rejects.toBe(dbError);
    expect(commit).not.toHaveBeenCalled();
    expect(rollback).toHaveBeenCalledOnce();
  });

  it("closes pool", async () => {
    mysqlState.end.mockResolvedValue(undefined);

    const client = createMysqlClient(config, "mysql");
    await client.close();

    expect(mysqlState.end).toHaveBeenCalledOnce();
  });
});
