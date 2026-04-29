import path from "node:path";
import { readFileSync } from "node:fs";

import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
  status,
  type ServiceDefinition,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

import { env } from "../config/env.js";
import { logger } from "../shared/logger.js";
import { withUnaryContext } from "./interceptors/unary-context.js";
import { addAuthGrpcService } from "./services/auth-service.js";
import { addCollectionsGrpcService } from "./services/collections-service.js";
import { addEnvironmentsGrpcService } from "./services/environments-service.js";
import { addImportExportGrpcService } from "./services/import-export-service.js";
import { addRunsGrpcService } from "./services/runs-service.js";
import { addWorkspacesGrpcService } from "./services/workspaces-service.js";

type HealthCheckRequest = {
  service?: string;
};

type HealthCheckResponse = {
  status: string;
  service: string;
  uptime_seconds: number;
};

type GrpcServerHandle = {
  server: Server;
  close: () => Promise<void>;
};

type LoadedDefinition = {
  role: {
    v1: {
      HealthService: {
        service: ServiceDefinition<UntypedServiceImplementation>;
      };
      AuthService: {
        service: ServiceDefinition<UntypedServiceImplementation>;
      };
      WorkspacesService: {
        service: ServiceDefinition<UntypedServiceImplementation>;
      };
      CollectionsService: {
        service: ServiceDefinition<UntypedServiceImplementation>;
      };
      EnvironmentsService: {
        service: ServiceDefinition<UntypedServiceImplementation>;
      };
      RunsService: {
        service: ServiceDefinition<UntypedServiceImplementation>;
      };
      ImportExportService: {
        service: ServiceDefinition<UntypedServiceImplementation>;
      };
    };
  };
};

const createHealthCheckResponse = (
  request: HealthCheckRequest,
): HealthCheckResponse => {
  const service = request.service?.trim() || "role-node";

  return {
    status: "SERVING",
    service,
    uptime_seconds: Math.floor(process.uptime()),
  };
};

const createGrpcServerCredentials = (): ServerCredentials => {
  if (!env.GRPC_TLS_ENABLED) {
    return ServerCredentials.createInsecure();
  }

  const certChain = readFileSync(env.GRPC_TLS_CERT_PATH!);
  const privateKey = readFileSync(env.GRPC_TLS_KEY_PATH!);
  const rootCerts = env.GRPC_TLS_CA_PATH
    ? readFileSync(env.GRPC_TLS_CA_PATH)
    : null;

  return ServerCredentials.createSsl(
    rootCerts,
    [{ cert_chain: certChain, private_key: privateKey }],
    env.GRPC_MTLS_ENABLED,
  );
};

export const startGrpcServer = async (options?: {
  port?: number;
  forceEnable?: boolean;
}): Promise<GrpcServerHandle | null> => {
  if (!env.GRPC_ENABLED && !options?.forceEnable) {
    logger.info("gRPC server is disabled by GRPC_ENABLED");
    return null;
  }

  const grpcPort = options?.port ?? env.GRPC_PORT;

  const protoPaths = [
    path.resolve(process.cwd(), "proto", "health.proto"),
    path.resolve(process.cwd(), "proto", "auth.proto"),
    path.resolve(process.cwd(), "proto", "collections.proto"),
    path.resolve(process.cwd(), "proto", "environments.proto"),
    path.resolve(process.cwd(), "proto", "import_export.proto"),
    path.resolve(process.cwd(), "proto", "runs.proto"),
    path.resolve(process.cwd(), "proto", "workspaces.proto"),
  ];
  const packageDefinition = loadSync(protoPaths, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const loadedDefinition = loadPackageDefinition(
    packageDefinition,
  ) as unknown as LoadedDefinition;

  const server = new Server();

  server.addService(loadedDefinition.role.v1.HealthService.service, {
    Check: withUnaryContext<HealthCheckRequest, HealthCheckResponse>(
      "HealthService.Check",
      {
        handler: async (call) => createHealthCheckResponse(call.request),
      },
    ),
  });

  const authGrpcService = addAuthGrpcService(loadedDefinition);
  server.addService(authGrpcService.service, authGrpcService.implementation);

  const workspacesGrpcService = addWorkspacesGrpcService(loadedDefinition);
  server.addService(
    workspacesGrpcService.service,
    workspacesGrpcService.implementation,
  );

  const collectionsGrpcService = addCollectionsGrpcService(loadedDefinition);
  server.addService(
    collectionsGrpcService.service,
    collectionsGrpcService.implementation,
  );

  const environmentsGrpcService = addEnvironmentsGrpcService(loadedDefinition);
  server.addService(
    environmentsGrpcService.service,
    environmentsGrpcService.implementation,
  );

  const runsGrpcService = addRunsGrpcService(loadedDefinition);
  server.addService(runsGrpcService.service, runsGrpcService.implementation);

  const importExportGrpcService = addImportExportGrpcService(loadedDefinition);
  server.addService(
    importExportGrpcService.service,
    importExportGrpcService.implementation,
  );

  await new Promise<void>((resolve, reject) => {
    server.bindAsync(
      `0.0.0.0:${grpcPort}`,
      createGrpcServerCredentials(),
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        logger.info(`gRPC server is running on port ${grpcPort}`, {
          tlsEnabled: env.GRPC_TLS_ENABLED,
          mtlsEnabled: env.GRPC_MTLS_ENABLED,
        });
        resolve();
      },
    );
  });

  return {
    server,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.tryShutdown((error) => {
          if (error) {
            reject({ code: status.INTERNAL, message: error.message });
            return;
          }

          resolve();
        });
      }),
  };
};
