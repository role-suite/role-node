import { app } from "./app.js";
import { closeDb } from "./config/db.js";
import { env } from "./config/env.js";
import { validateStartupOrThrow } from "./config/startup-validation.js";
import { logger } from "./shared/logger.js";

const startServer = async (): Promise<void> => {
  try {
    if (env.ENABLE_STARTUP_VALIDATION) {
      await validateStartupOrThrow();
    } else {
      logger.warn(
        "Startup validation is disabled by ENABLE_STARTUP_VALIDATION",
      );
    }

    app.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT}`, {
        localUrl: `http://localhost:${env.PORT}`,
      });
    });
  } catch (error) {
    logger.error("Startup validation failed", error);
    await closeDb();
    process.exit(1);
  }
};

void startServer();

const handleShutdown = async (signal: NodeJS.Signals): Promise<void> => {
  logger.info(`Received ${signal}, shutting down gracefully`);

  try {
    await closeDb();
  } catch (error) {
    logger.error("Error while closing database connections", error);
    process.exit(1);
  }

  process.exit(0);
};

process.once("SIGINT", () => {
  void handleShutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void handleShutdown("SIGTERM");
});
