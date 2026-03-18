import type { DatabaseClient, DatabaseConfig } from "../types/db.js";
import { createDatabaseClient } from "../shared/db/client-factory.js";

import { env } from "./env.js";

let dbClient: DatabaseClient | null = null;

const resolveDatabaseConfig = (): DatabaseConfig => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to initialize a database client");
  }

  return {
    connectionString: env.DATABASE_URL,
    poolMin: env.DB_POOL_MIN,
    poolMax: env.DB_POOL_MAX,
    ssl: env.DB_SSL,
  };
};

export const getDb = (): DatabaseClient => {
  if (!dbClient) {
    dbClient = createDatabaseClient(env.DB_DIALECT, resolveDatabaseConfig());
  }

  return dbClient;
};

export const closeDb = async (): Promise<void> => {
  if (!dbClient) {
    return;
  }

  await dbClient.close();
  dbClient = null;
};
