import type { DatabaseClient, DatabaseConfig } from "../../types/db.js";

import { createPostgresClient } from "./adapters/postgres.adapter.js";

export const createDatabaseClient = (
  config: DatabaseConfig,
): DatabaseClient => {
  return createPostgresClient(config);
};
