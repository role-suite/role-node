import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import {
  addWorkspaceMemberSchema,
  createWorkspaceSchema,
  listWorkspaceMembersSchema,
  workspaceUpdatesQuerySchema,
  updateWorkspaceMemberRoleSchema,
  workspaceMemberParamsSchema,
  workspaceIdSchema,
} from "./workspaces.schema.js";
import { workspacesService } from "./workspaces.service.js";

const requireAuthContext = (req: Request): NonNullable<Request["auth"]> => {
  if (!req.auth) {
    throw appResponse.withStatus(401, "Missing authenticated context");
  }

  return req.auth;
};

export const workspacesController = {
  async list(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const result = await workspacesService.listForUser(auth.userId);
    appResponse.sendSuccess(res, 200, result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceIdSchema.parse(req.params);
    const result = await workspacesService.getByIdForUser(
      auth.userId,
      workspaceId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async create(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const payload = createWorkspaceSchema.parse(req.body);
    const result = await workspacesService.createForUser(auth.userId, payload);
    appResponse.sendSuccess(res, 201, result);
  },

  async listMembers(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = listWorkspaceMembersSchema.parse(req.params);
    const result = await workspacesService.listMembersForUser(
      auth.userId,
      workspaceId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async addMember(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const params = workspaceIdSchema.parse(req.params);
    const body = addWorkspaceMemberSchema
      .omit({ workspaceId: true })
      .parse(req.body);
    const result = await workspacesService.addMemberForUser(auth.userId, {
      workspaceId: params.workspaceId,
      email: body.email,
      role: body.role,
    });
    appResponse.sendSuccess(res, 201, result);
  },

  async updateMemberRole(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const params = workspaceMemberParamsSchema.parse(req.params);
    const body = updateWorkspaceMemberRoleSchema
      .omit({
        workspaceId: true,
        memberUserId: true,
      })
      .parse(req.body);
    const result = await workspacesService.updateMemberRoleForUser(
      auth.userId,
      {
        workspaceId: params.workspaceId,
        memberUserId: params.memberUserId,
        role: body.role,
      },
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async removeMember(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, memberUserId } = workspaceMemberParamsSchema.parse(
      req.params,
    );
    await workspacesService.removeMemberForUser(
      auth.userId,
      workspaceId,
      memberUserId,
    );
    appResponse.sendSuccess(res, 200, { removed: true });
  },

  async leave(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceIdSchema.parse(req.params);
    await workspacesService.leaveForUser(auth.userId, workspaceId);
    appResponse.sendSuccess(res, 200, { left: true });
  },

  async listUpdates(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceIdSchema.parse(req.params);
    const query = workspaceUpdatesQuerySchema.parse(req.query);
    const result = await workspacesService.listUpdatesForUser(
      auth.userId,
      workspaceId,
      query,
    );
    appResponse.sendSuccess(res, 200, result);
  },
};
