import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import {
  createWorkspaceExportSchema,
  createWorkspaceImportSchema,
  workspaceImportExportJobByIdParamsSchema,
  workspaceImportExportParamsSchema,
} from "./import-export.schema.js";
import { importExportService } from "./import-export.service.js";

const requireAuthContext = (req: Request): NonNullable<Request["auth"]> => {
  if (!req.auth) {
    throw appResponse.withStatus(401, "Missing authenticated context");
  }

  return req.auth;
};

export const importExportController = {
  async listJobs(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceImportExportParamsSchema.parse(req.params);
    const result = await importExportService.listJobsForWorkspace(
      auth.userId,
      workspaceId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async getJobById(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, jobId } =
      workspaceImportExportJobByIdParamsSchema.parse(req.params);
    const result = await importExportService.getJobByIdForWorkspace(
      auth.userId,
      workspaceId,
      jobId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async createExport(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceImportExportParamsSchema.parse(req.params);
    const payload = createWorkspaceExportSchema.parse(req.body);
    const result = await importExportService.createExportJobForWorkspace(
      auth.userId,
      workspaceId,
      payload,
    );
    appResponse.sendSuccess(res, 201, result);
  },

  async createImport(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceImportExportParamsSchema.parse(req.params);
    const payload = createWorkspaceImportSchema.parse(req.body);
    const result = await importExportService.createImportJobForWorkspace(
      auth.userId,
      workspaceId,
      payload,
    );
    appResponse.sendSuccess(res, 201, result);
  },
};
