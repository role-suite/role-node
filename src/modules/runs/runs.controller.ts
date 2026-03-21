import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import { runsService } from "./runs.service.js";
import {
  createRunSchema,
  workspaceRunByIdParamsSchema,
  workspaceRunParamsSchema,
} from "./runs.schema.js";

const requireAuthContext = (req: Request): NonNullable<Request["auth"]> => {
  if (!req.auth) {
    throw appResponse.withStatus(401, "Missing authenticated context");
  }

  return req.auth;
};

export const runsController = {
  async create(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceRunParamsSchema.parse(req.params);
    const payload = createRunSchema.parse(req.body);
    const result = await runsService.createRunForWorkspace(
      auth.userId,
      workspaceId,
      payload,
    );
    appResponse.sendSuccess(res, 201, result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, runId } = workspaceRunByIdParamsSchema.parse(
      req.params,
    );
    const result = await runsService.getRunByIdForWorkspace(
      auth.userId,
      workspaceId,
      runId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async cancel(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, runId } = workspaceRunByIdParamsSchema.parse(
      req.params,
    );
    const result = await runsService.cancelRunForWorkspace(
      auth.userId,
      workspaceId,
      runId,
    );
    appResponse.sendSuccess(res, 200, result);
  },
};
