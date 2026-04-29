import type {
  ServiceDefinition,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";

import {
  createWorkspaceExportSchema,
  createWorkspaceImportSchema,
  workspaceImportExportJobByIdParamsSchema,
  workspaceImportExportParamsSchema,
} from "../../modules/import-export/import-export.schema.js";
import { importExportService } from "../../modules/import-export/import-export.service.js";
import { withUnaryContext } from "../interceptors/unary-context.js";
import {
  parseImportExportPayload,
  toGrpcImportExportJob,
  toGrpcImportExportJobs,
} from "../mappers/import-export.js";

type ImportExportServiceDefinition = {
  service: ServiceDefinition<UntypedServiceImplementation>;
};

type ServiceRoot = {
  role: {
    v1: {
      ImportExportService: ImportExportServiceDefinition;
    };
  };
};

export const addImportExportGrpcService = (root: ServiceRoot) => {
  return {
    service: root.role.v1.ImportExportService.service,
    implementation: {
      ListJobs: withUnaryContext<
        { workspace_id: number },
        { jobs_json: string[] }
      >("ImportExportService.ListJobs", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId } = workspaceImportExportParamsSchema.parse({
            workspaceId: call.request.workspace_id,
          });
          const jobs = await importExportService.listJobsForWorkspace(
            context.auth!.userId,
            workspaceId,
          );
          return toGrpcImportExportJobs(jobs);
        },
      }),
      GetJobById: withUnaryContext<
        { workspace_id: number; job_id: number },
        { job_json: string }
      >("ImportExportService.GetJobById", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, jobId } =
            workspaceImportExportJobByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              jobId: call.request.job_id,
            });
          const job = await importExportService.getJobByIdForWorkspace(
            context.auth!.userId,
            workspaceId,
            jobId,
          );
          return toGrpcImportExportJob(job);
        },
      }),
      CreateExportJob: withUnaryContext<
        { workspace_id: number; payload_json: string },
        { job_json: string }
      >("ImportExportService.CreateExportJob", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId } = workspaceImportExportParamsSchema.parse({
            workspaceId: call.request.workspace_id,
          });
          const payload = createWorkspaceExportSchema.parse(
            parseImportExportPayload(call.request.payload_json),
          );
          const job = await importExportService.createExportJobForWorkspace(
            context.auth!.userId,
            workspaceId,
            payload,
          );
          return toGrpcImportExportJob(job);
        },
      }),
      CreateImportJob: withUnaryContext<
        { workspace_id: number; payload_json: string },
        { job_json: string }
      >("ImportExportService.CreateImportJob", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId } = workspaceImportExportParamsSchema.parse({
            workspaceId: call.request.workspace_id,
          });
          const payload = createWorkspaceImportSchema.parse(
            parseImportExportPayload(call.request.payload_json),
          );
          const job = await importExportService.createImportJobForWorkspace(
            context.auth!.userId,
            workspaceId,
            payload,
          );
          return toGrpcImportExportJob(job);
        },
      }),
    } as UntypedServiceImplementation,
  };
};
