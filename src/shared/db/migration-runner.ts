import type { DatabaseClient } from "../../types/db.js";
import type {
  MigrationDefinition,
  MigrationStatus,
} from "../../types/db-migration.js";

const MIGRATIONS_TABLE = "app_migrations";

const createTableSql = `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

const readAppliedIds = async (db: DatabaseClient): Promise<string[]> => {
  const result = await db.query<{ id: string }>(
    `SELECT id FROM ${MIGRATIONS_TABLE} ORDER BY id ASC`,
  );

  return result.rows.map((row) => row.id);
};

const insertAppliedId = async (
  db: DatabaseClient,
  id: string,
): Promise<void> => {
  await db.query(`INSERT INTO ${MIGRATIONS_TABLE} (id) VALUES ($1)`, [id]);
};

const deleteAppliedId = async (
  db: DatabaseClient,
  id: string,
): Promise<void> => {
  await db.query(`DELETE FROM ${MIGRATIONS_TABLE} WHERE id = $1`, [id]);
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
): Promise<void> => {
  await db.query(createTableSql);
};

export const getMigrationStatus = async (
  db: DatabaseClient,
  migrations: readonly MigrationDefinition[],
): Promise<MigrationStatus> => {
  await ensureMigrationsTable(db);

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
  migrations: readonly MigrationDefinition[],
  limit?: number,
): Promise<string[]> => {
  await ensureMigrationsTable(db);

  const appliedSet = new Set(await readAppliedIds(db));
  const pending = migrations.filter(
    (migration) => !appliedSet.has(migration.id),
  );
  const selected = limit && limit > 0 ? pending.slice(0, limit) : pending;

  const appliedNow: string[] = [];

  for (const migration of selected) {
    await db.transaction(async (tx) => {
      await migration.up({ db: tx });
      await insertAppliedId(tx, migration.id);
    });

    appliedNow.push(migration.id);
  }

  return appliedNow;
};

export const rollbackMigrations = async (
  db: DatabaseClient,
  migrations: readonly MigrationDefinition[],
  count = 1,
): Promise<string[]> => {
  await ensureMigrationsTable(db);

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
      await migration.down({ db: tx });
      await deleteAppliedId(tx, migration.id);
    });

    rolledBack.push(migration.id);
  }

  return rolledBack;
};
