import { logger } from "../shared/logger.js";
import type { DbDialect } from "../types/db.js";

import { getDb } from "./db.js";
import { env } from "./env.js";

const DIALECT_PROTOCOLS: Record<DbDialect, readonly string[]> = {
  postgres: ["postgres:", "postgresql:"],
  mysql: ["mysql:"],
  mariadb: ["mariadb:", "mysql:"],
};

const parseDatabaseUrl = (databaseUrl: string): URL => {
  try {
    return new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid URL");
  }
};

const validateDatabaseUrl = (): URL => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for startup validation");
  }

  const parsedUrl = parseDatabaseUrl(env.DATABASE_URL);
  const allowedProtocols = DIALECT_PROTOCOLS[env.DB_DIALECT];

  if (!allowedProtocols.includes(parsedUrl.protocol)) {
    throw new Error(
      `DATABASE_URL protocol \"${parsedUrl.protocol}\" does not match DB_DIALECT \"${env.DB_DIALECT}\"`,
    );
  }

  return parsedUrl;
};

export const validateStartupOrThrow = async (): Promise<void> => {
  if (env.PORT > 65535) {
    throw new Error("PORT must be between 1 and 65535");
  }

  const parsedUrl = validateDatabaseUrl();

  try {
    await getDb().query("SELECT 1");
  } catch (error) {
    throw new Error("Database connectivity check failed", { cause: error });
  }

  logger.info("Startup validation passed", {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    dbDialect: env.DB_DIALECT,
    dbHost: parsedUrl.hostname,
  });
};
