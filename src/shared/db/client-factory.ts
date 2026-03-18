import type {
  DatabaseClient,
  DatabaseConfig,
  DbDialect,
} from "../../types/db.js";

import { createMysqlClient } from "./adapters/mysql.adapter.js";
import { createPostgresClient } from "./adapters/postgres.adapter.js";

export const createDatabaseClient = (
  dialect: DbDialect,
  config: DatabaseConfig,
): DatabaseClient => {
  switch (dialect) {
    case "postgres":
      return createPostgresClient(config);
    case "mysql":
    case "mariadb":
      return createMysqlClient(config, dialect);
    default: {
      const unsupportedDialect: never = dialect;
      throw new Error(`Unsupported database dialect: ${unsupportedDialect}`);
    }
  }
};
