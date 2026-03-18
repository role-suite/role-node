import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { env } from "../src/config/env.js";
import { createDatabaseClient } from "../src/shared/db/client-factory.js";
import {
  applyMigrations,
  getMigrationStatus,
  rollbackMigrations,
} from "../src/shared/db/migrations/runner.js";
import type {
  MigrationDefinition,
  MigrationHandler,
} from "../src/types/db-migration.js";

type CliCommand = "up" | "down" | "status";

const rootDir = process.cwd();
const migrationsDir = path.join(rootDir, "migrations");

const toMigrationId = (fileName: string): string => {
  return fileName.replace(/\.migration\.(ts|js|mjs|cjs)$/u, "");
};

const isMigrationFile = (fileName: string): boolean => {
  return /\.migration\.(ts|js|mjs|cjs)$/u.test(fileName);
};

const assertHandler = (
  value: unknown,
  exportName: string,
  fileName: string,
): asserts value is MigrationHandler => {
  if (typeof value !== "function") {
    throw new Error(
      `Migration '${fileName}' must export '${exportName}' function`,
    );
  }
};

const loadMigrations = async (): Promise<MigrationDefinition[]> => {
  let entries;

  try {
    entries = await readdir(migrationsDir, { withFileTypes: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(isMigrationFile)
    .sort((left, right) => left.localeCompare(right));

  const migrations: MigrationDefinition[] = [];

  for (const fileName of files) {
    const filePath = path.join(migrationsDir, fileName);
    const moduleUrl = pathToFileURL(filePath).href;
    const loadedModule = (await import(moduleUrl)) as {
      up?: unknown;
      down?: unknown;
    };

    assertHandler(loadedModule.up, "up", fileName);
    assertHandler(loadedModule.down, "down", fileName);

    migrations.push({
      id: toMigrationId(fileName),
      up: loadedModule.up,
      down: loadedModule.down,
    });
  }

  return migrations;
};

const parseCount = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const count = Number(value);

  if (!Number.isInteger(count) || count <= 0) {
    throw new Error("Count value must be a positive integer");
  }

  return count;
};

const printUsage = (): void => {
  console.log("Usage: pnpm db:migrate [up|down|status] [count]");
  console.log("Examples:");
  console.log("  pnpm db:migrate");
  console.log("  pnpm db:migrate up 2");
  console.log("  pnpm db:migrate down 1");
  console.log("  pnpm db:migrate status");
};

const run = async (): Promise<void> => {
  const command = (process.argv[2] ?? "up") as CliCommand;
  const count = parseCount(process.argv[3]);

  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for running migrations");
  }

  if (!["up", "down", "status"].includes(command)) {
    printUsage();
    throw new Error(`Unsupported migration command: ${command}`);
  }

  const db = createDatabaseClient(env.DB_DIALECT, {
    connectionString: env.DATABASE_URL,
    poolMin: env.DB_POOL_MIN,
    poolMax: env.DB_POOL_MAX,
    ssl: env.DB_SSL,
  });

  try {
    const migrations = await loadMigrations();

    if (command === "status") {
      const status = await getMigrationStatus(db, env.DB_DIALECT, migrations);
      console.log(JSON.stringify(status, null, 2));
      return;
    }

    if (command === "down") {
      const rolledBack = await rollbackMigrations(
        db,
        env.DB_DIALECT,
        migrations,
        count ?? 1,
      );
      console.log(
        `Rolled back migrations: ${rolledBack.length > 0 ? rolledBack.join(", ") : "none"}`,
      );
      return;
    }

    const applied = await applyMigrations(
      db,
      env.DB_DIALECT,
      migrations,
      count,
    );
    console.log(
      `Applied migrations: ${applied.length > 0 ? applied.join(", ") : "none"}`,
    );
  } finally {
    await db.close();
  }
};

run().catch((error) => {
  console.error("Migration command failed", error);
  process.exit(1);
});
