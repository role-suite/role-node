import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyMigrations,
  getMigrationStatus,
  rollbackMigrations,
} from "../../src/shared/db/migrations/runner.js";
import type {
  DatabaseClient,
  DbDialect,
  QueryParams,
  QueryResult,
  QueryRow,
} from "../../src/types/db.js";
import type { MigrationDefinition } from "../../src/types/db-migration.js";

type FakeDbState = {
  applied: string[];
  ensureTableCalls: number;
  queryLog: string[];
};

const createFakeDb = (
  dialect: DbDialect,
  state: FakeDbState,
): DatabaseClient => {
  const query = async <TRow extends QueryRow = QueryRow>(
    sql: string,
    params: QueryParams = [],
  ): Promise<QueryResult<TRow>> => {
    state.queryLog.push(sql);
    const normalized = sql.replace(/\s+/g, " ").trim().toLowerCase();

    if (normalized.startsWith("create table if not exists app_migrations")) {
      state.ensureTableCalls += 1;
      return { rows: [] as TRow[], rowCount: 0 };
    }

    if (
      normalized.startsWith("select id from app_migrations order by id asc")
    ) {
      const rows = [...state.applied].sort().map((id) => ({ id })) as TRow[];
      return { rows, rowCount: rows.length };
    }

    if (
      normalized.startsWith(
        "select id from app_migrations order by applied_at desc, id desc limit 1",
      )
    ) {
      const id = state.applied[state.applied.length - 1];
      const rows = id ? ([{ id }] as TRow[]) : [];
      return { rows, rowCount: rows.length };
    }

    if (normalized.startsWith("insert into app_migrations (id) values")) {
      const id = params[0];

      if (typeof id !== "string") {
        throw new Error("Expected string migration id for insert");
      }

      state.applied.push(id);
      return { rows: [] as TRow[], rowCount: 1 };
    }

    if (normalized.startsWith("delete from app_migrations where id")) {
      const id = params[0];

      if (typeof id !== "string") {
        throw new Error("Expected string migration id for delete");
      }

      state.applied = state.applied.filter((item) => item !== id);
      return { rows: [] as TRow[], rowCount: 1 };
    }

    throw new Error(`Unexpected query in fake DB: ${sql}`);
  };

  const db: DatabaseClient = {
    dialect,
    query,
    transaction: async <T>(
      callback: (tx: DatabaseClient) => Promise<T>,
    ): Promise<T> => callback(db),
    close: async (): Promise<void> => Promise.resolve(),
  };

  return db;
};

const createMigration = (id: string): MigrationDefinition => {
  return {
    id,
    up: vi.fn(async () => Promise.resolve()),
    down: vi.fn(async () => Promise.resolve()),
  };
};

describe("migration runner", () => {
  let state: FakeDbState;
  let db: DatabaseClient;

  beforeEach(() => {
    state = {
      applied: [],
      ensureTableCalls: 0,
      queryLog: [],
    };
    db = createFakeDb("postgres", state);
  });

  it("applies pending migrations and respects limit", async () => {
    const first = createMigration("001_init");
    const second = createMigration("002_add_users");

    const firstRun = await applyMigrations(db, "postgres", [first, second], 1);
    const secondRun = await applyMigrations(db, "postgres", [first, second]);

    expect(firstRun).toEqual(["001_init"]);
    expect(secondRun).toEqual(["002_add_users"]);
    expect(first.up).toHaveBeenCalledOnce();
    expect(second.up).toHaveBeenCalledOnce();
    expect(state.applied).toEqual(["001_init", "002_add_users"]);
  });

  it("returns migration status", async () => {
    state.applied = ["001_init"];
    const first = createMigration("001_init");
    const second = createMigration("002_add_users");

    const status = await getMigrationStatus(db, "postgres", [first, second]);

    expect(status).toEqual({
      applied: ["001_init"],
      pending: ["002_add_users"],
    });
  });

  it("rolls back latest migrations", async () => {
    const first = createMigration("001_init");
    const second = createMigration("002_add_users");
    state.applied = ["001_init", "002_add_users"];

    const rolledBack = await rollbackMigrations(
      db,
      "postgres",
      [first, second],
      1,
    );

    expect(rolledBack).toEqual(["002_add_users"]);
    expect(second.down).toHaveBeenCalledOnce();
    expect(first.down).not.toHaveBeenCalled();
    expect(state.applied).toEqual(["001_init"]);
  });

  it("throws when latest applied migration definition is missing", async () => {
    state.applied = ["999_missing"];

    await expect(
      rollbackMigrations(db, "postgres", [createMigration("001_init")], 1),
    ).rejects.toThrowError(
      "Cannot rollback migration '999_missing': definition file not found",
    );
  });

  it("uses mysql parameter placeholders for migration records", async () => {
    const mysqlState: FakeDbState = {
      applied: ["001_init"],
      ensureTableCalls: 0,
      queryLog: [],
    };
    const mysqlDb = createFakeDb("mysql", mysqlState);
    const first = createMigration("001_init");
    const second = createMigration("002_add_users");

    await applyMigrations(mysqlDb, "mysql", [first, second]);
    await rollbackMigrations(mysqlDb, "mysql", [first, second], 0);

    const normalizedLog = mysqlState.queryLog.map((sql) =>
      sql.replace(/\s+/g, " ").trim().toLowerCase(),
    );

    expect(
      normalizedLog.some((sql) =>
        sql.includes("insert into app_migrations (id) values (?)"),
      ),
    ).toBe(true);
    expect(
      normalizedLog.some((sql) =>
        sql.includes("delete from app_migrations where id = ?"),
      ),
    ).toBe(true);
  });
});
