import { logger } from "../shared/logger.js";

import { getDb } from "./db.js";
import { env } from "./env.js";

export const validateStartupOrThrow = async (): Promise<void> => {
  if (env.PORT > 65535) {
    throw new Error("PORT must be between 1 and 65535");
  }

  try {
    await getDb().query("SELECT 1");
  } catch (error) {
    throw new Error("Database connectivity check failed", { cause: error });
  }

  logger.info("Startup validation passed", {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    dbDialect: "postgres",
    dbHost: env.DB_HOST,
  });
};
