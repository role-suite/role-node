import type { DatabaseClient, DbDialect } from "../../../types/db.js";
import type {
  MigrationDefinition,
  MigrationStatus,
} from "../../../types/db-migration.js";

const MIGRATIONS_TABLE = "app_migrations";

const createTableSqlByDialect: Record<DbDialect, string> = {
  postgres: `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
  mysql: `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
  mariadb: `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
};

const resolveParamToken = (dialect: DbDialect): string => {
  return dialect === "postgres" ? "$1" : "?";
};

const readAppliedIds = async (db: DatabaseClient): Promise<string[]> => {
  const result = await db.query<{ id: string }>(
    `SELECT id FROM ${MIGRATIONS_TABLE} ORDER BY id ASC`,
  );

  return result.rows.map((row) => row.id);
};

const insertAppliedId = async (
  db: DatabaseClient,
  dialect: DbDialect,
  id: string,
): Promise<void> => {
  const token = resolveParamToken(dialect);
  await db.query(`INSERT INTO ${MIGRATIONS_TABLE} (id) VALUES (${token})`, [
    id,
  ]);
};

const deleteAppliedId = async (
  db: DatabaseClient,
  dialect: DbDialect,
  id: string,
): Promise<void> => {
  const token = resolveParamToken(dialect);
  await db.query(`DELETE FROM ${MIGRATIONS_TABLE} WHERE id = ${token}`, [id]);
};

const readLastAppliedId = async (
  db: DatabaseClient,
): Promise<string | null> => {
  const result = await db.query<{ id: string }>(
    `SELECT id FROM ${MIGRATIONS_TABLE} ORDER BY applied_at DESC, id DESC LIMIT 1`,
  );

  return result.rows[0]?.id ?? null;
};

export const ensureMigrationsTable = async (
  db: DatabaseClient,
  dialect: DbDialect,
): Promise<void> => {
  await db.query(createTableSqlByDialect[dialect]);
};

export const getMigrationStatus = async (
  db: DatabaseClient,
  dialect: DbDialect,
  migrations: readonly MigrationDefinition[],
): Promise<MigrationStatus> => {
  await ensureMigrationsTable(db, dialect);

  const applied = await readAppliedIds(db);
  const appliedSet = new Set(applied);
  const pending = migrations
    .map((migration) => migration.id)
    .filter((id) => !appliedSet.has(id));

  return {
    applied,
    pending,
  };
};

export const applyMigrations = async (
  db: DatabaseClient,
  dialect: DbDialect,
  migrations: readonly MigrationDefinition[],
  limit?: number,
): Promise<string[]> => {
  await ensureMigrationsTable(db, dialect);

  const appliedSet = new Set(await readAppliedIds(db));
  const pending = migrations.filter(
    (migration) => !appliedSet.has(migration.id),
  );
  const selected = limit && limit > 0 ? pending.slice(0, limit) : pending;

  const appliedNow: string[] = [];

  for (const migration of selected) {
    await db.transaction(async (tx) => {
      await migration.up({ db: tx, dialect });
      await insertAppliedId(tx, dialect, migration.id);
    });

    appliedNow.push(migration.id);
  }

  return appliedNow;
};

export const rollbackMigrations = async (
  db: DatabaseClient,
  dialect: DbDialect,
  migrations: readonly MigrationDefinition[],
  count = 1,
): Promise<string[]> => {
  await ensureMigrationsTable(db, dialect);

  const rolledBack: string[] = [];
  const rollbackCount = count > 0 ? count : 1;

  for (let index = 0; index < rollbackCount; index += 1) {
    const lastAppliedId = await readLastAppliedId(db);

    if (!lastAppliedId) {
      break;
    }

    const migration = migrations.find((item) => item.id === lastAppliedId);

    if (!migration) {
      throw new Error(
        `Cannot rollback migration '${lastAppliedId}': definition file not found`,
      );
    }

    await db.transaction(async (tx) => {
      await migration.down({ db: tx, dialect });
      await deleteAppliedId(tx, dialect, migration.id);
    });

    rolledBack.push(migration.id);
  }

  return rolledBack;
};
