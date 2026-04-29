import type {
  ServiceDefinition,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";

import {
  createRunSchema,
  workspaceRunByIdParamsSchema,
  workspaceRunParamsSchema,
} from "../../modules/runs/runs.schema.js";
import { runsService } from "../../modules/runs/runs.service.js";
import { withUnaryContext } from "../interceptors/unary-context.js";
import { parseRunCreatePayload, toGrpcRunResponse } from "../mappers/runs.js";

type RunsServiceDefinition = {
  service: ServiceDefinition<UntypedServiceImplementation>;
};

type ServiceRoot = {
  role: {
    v1: {
      RunsService: RunsServiceDefinition;
    };
  };
};

export const addRunsGrpcService = (root: ServiceRoot) => {
  return {
    service: root.role.v1.RunsService.service,
    implementation: {
      Create: withUnaryContext<
        { workspace_id: number; payload_json: string },
        { run_json: string }
      >("RunsService.Create", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId } = workspaceRunParamsSchema.parse({
            workspaceId: call.request.workspace_id,
          });
          const payload = createRunSchema.parse(
            parseRunCreatePayload(call.request.payload_json),
          );
          const result = await runsService.createRunForWorkspace(
            context.auth!.userId,
            workspaceId,
            payload,
          );
          return toGrpcRunResponse(result);
        },
      }),
      GetById: withUnaryContext<
        { workspace_id: number; run_id: number },
        { run_json: string }
      >("RunsService.GetById", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, runId } = workspaceRunByIdParamsSchema.parse({
            workspaceId: call.request.workspace_id,
            runId: call.request.run_id,
          });
          const result = await runsService.getRunByIdForWorkspace(
            context.auth!.userId,
            workspaceId,
            runId,
          );
          return toGrpcRunResponse(result);
        },
      }),
      Cancel: withUnaryContext<
        { workspace_id: number; run_id: number },
        { run_json: string }
      >("RunsService.Cancel", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, runId } = workspaceRunByIdParamsSchema.parse({
            workspaceId: call.request.workspace_id,
            runId: call.request.run_id,
          });
          const result = await runsService.cancelRunForWorkspace(
            context.auth!.userId,
            workspaceId,
            runId,
          );
          return toGrpcRunResponse(result);
        },
      }),
    } as UntypedServiceImplementation,
  };
};
