import type { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";

import { runWithRequestContext } from "../../shared/request-context.js";
import { logger } from "../../shared/logger.js";
import { toGrpcServiceError } from "./error-mapper.js";
import { resolveAuthenticatedContext } from "./auth-metadata.js";
import { createRequestMetadata, resolveRequestId } from "./request-id.js";

type GrpcExecutionContext = {
  requestId: string;
  auth?: {
    userId: number;
    workspaceId: number;
    sessionId: number;
    role: "owner" | "admin" | "member";
  };
};

type UnaryHandler<Request, Response> = (
  call: ServerUnaryCall<Request, Response>,
  context: GrpcExecutionContext,
) => Promise<Response>;

export const withUnaryContext = <Request, Response>(
  operationName: string,
  options: {
    requireAuth?: boolean;
    handler: UnaryHandler<Request, Response>;
  },
): ((
  call: ServerUnaryCall<Request, Response>,
  callback: sendUnaryData<Response>,
) => void) => {
  return (call, callback) => {
    const requestId = resolveRequestId(call.metadata);
    const responseMetadata = createRequestMetadata(requestId);
    const startedAt = Date.now();

    runWithRequestContext(requestId, () => {
      void (async () => {
        try {
          const context: GrpcExecutionContext = { requestId };

          if (options.requireAuth) {
            context.auth = await resolveAuthenticatedContext(call.metadata);
          }

          const response = await options.handler(call, context);
          logger.info("gRPC request completed", {
            requestId,
            operationName,
            durationMs: Date.now() - startedAt,
          });

          callback(null, response, responseMetadata);
        } catch (error) {
          const mappedError = toGrpcServiceError(error, requestId);
          logger.warn("gRPC request failed", {
            requestId,
            operationName,
            durationMs: Date.now() - startedAt,
            grpcCode: mappedError.code,
            grpcMessage: mappedError.message,
          });

          callback(mappedError);
        }
      })();
    });
  };
};

export type { GrpcExecutionContext };
