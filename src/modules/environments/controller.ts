import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
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
    throw createAppError(ERROR_CODES.common.MISSING_AUTHENTICATED_CONTEXT);
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
    appResponse.sendList(res, 200, result);
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
    appResponse.sendObject(res, 200, result);
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
    appResponse.sendObject(res, 201, result);
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
    appResponse.sendObject(res, 200, result);
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
    appResponse.sendAction(res, 200, "deleted");
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
    appResponse.sendList(res, 200, result);
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
    appResponse.sendObject(res, 200, result);
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
    appResponse.sendObject(res, 201, result);
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
    appResponse.sendObject(res, 200, result);
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
    appResponse.sendAction(res, 200, "deleted");
  },
};
