import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import {
  createEnvironmentSchema,
  createEnvironmentVariableSchema,
  updateEnvironmentSchema,
  updateEnvironmentVariableSchema,
  workspaceEnvironmentByIdParamsSchema,
  workspaceEnvironmentParamsSchema,
  workspaceEnvironmentVariableByIdParamsSchema,
} from "./environments.schema.js";
import { environmentsService } from "./environments.service.js";

const requireAuthContext = (req: Request): NonNullable<Request["auth"]> => {
  if (!req.auth) {
    throw appResponse.withStatus(401, "Missing authenticated context");
  }

  return req.auth;
};

export const environmentsController = {
  async list(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceEnvironmentParamsSchema.parse(req.params);
    const result = await environmentsService.listForWorkspace(
      auth.userId,
      workspaceId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, environmentId } =
      workspaceEnvironmentByIdParamsSchema.parse(req.params);
    const result = await environmentsService.getByIdForWorkspace(
      auth.userId,
      workspaceId,
      environmentId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async create(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceEnvironmentParamsSchema.parse(req.params);
    const payload = createEnvironmentSchema.parse(req.body);
    const result = await environmentsService.createForWorkspace(
      auth.userId,
      workspaceId,
      payload,
    );
    appResponse.sendSuccess(res, 201, result);
  },

  async update(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, environmentId } =
      workspaceEnvironmentByIdParamsSchema.parse(req.params);
    const payload = updateEnvironmentSchema.parse(req.body);
    const result = await environmentsService.updateForWorkspace(
      auth.userId,
      workspaceId,
      environmentId,
      payload,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async remove(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, environmentId } =
      workspaceEnvironmentByIdParamsSchema.parse(req.params);
    await environmentsService.deleteForWorkspace(
      auth.userId,
      workspaceId,
      environmentId,
    );
    appResponse.sendSuccess(res, 200, { deleted: true });
  },

  async listVariables(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, environmentId } =
      workspaceEnvironmentByIdParamsSchema.parse(req.params);
    const result = await environmentsService.listVariablesForEnvironment(
      auth.userId,
      workspaceId,
      environmentId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async getVariableById(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, environmentId, variableId } =
      workspaceEnvironmentVariableByIdParamsSchema.parse(req.params);
    const result = await environmentsService.getVariableByIdForEnvironment(
      auth.userId,
      workspaceId,
      environmentId,
      variableId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async createVariable(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, environmentId } =
      workspaceEnvironmentByIdParamsSchema.parse(req.params);
    const payload = createEnvironmentVariableSchema.parse(req.body);
    const result = await environmentsService.createVariableForEnvironment(
      auth.userId,
      workspaceId,
      environmentId,
      payload,
    );
    appResponse.sendSuccess(res, 201, result);
  },

  async updateVariable(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, environmentId, variableId } =
      workspaceEnvironmentVariableByIdParamsSchema.parse(req.params);
    const payload = updateEnvironmentVariableSchema.parse(req.body);
    const result = await environmentsService.updateVariableForEnvironment(
      auth.userId,
      workspaceId,
      environmentId,
      variableId,
      payload,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async removeVariable(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, environmentId, variableId } =
      workspaceEnvironmentVariableByIdParamsSchema.parse(req.params);
    await environmentsService.deleteVariableForEnvironment(
      auth.userId,
      workspaceId,
      environmentId,
      variableId,
    );
    appResponse.sendSuccess(res, 200, { deleted: true });
  },
};
