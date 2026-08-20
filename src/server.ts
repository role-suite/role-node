import { Server as HttpServer } from "node:http";

import { app } from "./app.js";
import { closeDb } from "./config/db.js";
import { env } from "./config/env.js";
import { closeKyselyDb } from "./config/kysely.js";
import { validateStartupOrThrow } from "./config/startup-validation.js";
import { startGrpcServer } from "./grpc/server.js";
import { logger } from "./shared/logger.js";

let httpServer: HttpServer | null = null;
let grpcServerHandle: Awaited<ReturnType<typeof startGrpcServer>> = null;

const startServer = async (): Promise<void> => {
  try {

    if (env.ENABLE_STARTUP_VALIDATION) {
      await validateStartupOrThrow();
    } else {
      logger.warn(
        "Startup validation is disabled by ENABLE_STARTUP_VALIDATION",
      );
    }

    grpcServerHandle = await startGrpcServer();

    httpServer = app.listen(env.PORT, () => {
      logger.info(`REST API Server is running on port ${env.PORT}`, {
        localUrl: `http://localhost:${env.PORT}`,
      });
    });
  } catch (error) {
    logger.error("Startup validation failed", error);
    await closeDb();
    await closeKyselyDb();
    process.exit(1);
  }
};

void startServer();

const handleShutdown = async (signal: NodeJS.Signals): Promise<void> => {
  logger.info(`Received ${signal}, shutting down gracefully`);

  try {
    if (httpServer) {
      await new Promise<void>((resolve, reject) => {
        httpServer?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    if (grpcServerHandle) {
      await grpcServerHandle.close();
    }

    await closeDb();
    await closeKyselyDb();
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
