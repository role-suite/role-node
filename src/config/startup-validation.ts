import { access } from "node:fs/promises";
import { constants } from "node:fs";

import { logger } from "../shared/logger.js";

import { getDb } from "./db.js";
import { env } from "./env.js";

export const validateStartupOrThrow = async (): Promise<void> => {
  if (env.PORT > 65535) {
    throw new Error("PORT must be between 1 and 65535");
  }

  if (env.GRPC_ENABLED && env.GRPC_PORT > 65535) {
    throw new Error("GRPC_PORT must be between 1 and 65535");
  }

  if (env.GRPC_ENABLED && env.GRPC_TLS_ENABLED) {
    await access(env.GRPC_TLS_CERT_PATH!, constants.R_OK);
    await access(env.GRPC_TLS_KEY_PATH!, constants.R_OK);

    if (env.GRPC_MTLS_ENABLED) {
      await access(env.GRPC_TLS_CA_PATH!, constants.R_OK);
    }
  }

  try {
    await getDb().query("SELECT 1");
  } catch (error) {
    throw new Error("Database connectivity check failed", { cause: error });
  }

  logger.info("Startup validation passed", {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    grpcEnabled: env.GRPC_ENABLED,
    grpcPort: env.GRPC_PORT,
    grpcTlsEnabled: env.GRPC_TLS_ENABLED,
    grpcMtlsEnabled: env.GRPC_MTLS_ENABLED,
    dbDialect: env.DB_DIALECT,
    dbHost: env.DB_HOST,
  });
};
