import type { DatabaseClient, DbDialect } from "./db.js";

export type MigrationContext = {
  db: DatabaseClient;
  dialect: DbDialect;
};

export type MigrationHandler = (context: MigrationContext) => Promise<void>;

export type MigrationDefinition = {
  id: string;
  up: MigrationHandler;
  down: MigrationHandler;
};

export type MigrationStatus = {
  applied: string[];
  pending: string[];
};
