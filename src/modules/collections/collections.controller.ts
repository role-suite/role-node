import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";

import {
  createCollectionEndpointSchema,
  createCollectionSchema,
  updateCollectionSchema,
  updateCollectionEndpointSchema,
  workspaceCollectionByIdParamsSchema,
  workspaceCollectionEndpointByIdParamsSchema,
  workspaceCollectionParamsSchema,
} from "./collections.schema.js";
import { collectionsService } from "./collections.service.js";

const requireAuthContext = (req: Request): NonNullable<Request["auth"]> => {
  if (!req.auth) {
    throw appResponse.withStatus(401, "Missing authenticated context");
  }

  return req.auth;
};

export const collectionsController = {
  async list(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceCollectionParamsSchema.parse(req.params);
    const result = await collectionsService.listForWorkspace(
      auth.userId,
      workspaceId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId } =
      workspaceCollectionByIdParamsSchema.parse(req.params);
    const result = await collectionsService.getByIdForWorkspace(
      auth.userId,
      workspaceId,
      collectionId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async create(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId } = workspaceCollectionParamsSchema.parse(req.params);
    const payload = createCollectionSchema.parse(req.body);
    const result = await collectionsService.createForWorkspace(
      auth.userId,
      workspaceId,
      payload,
    );
    appResponse.sendSuccess(res, 201, result);
  },

  async update(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId } =
      workspaceCollectionByIdParamsSchema.parse(req.params);
    const payload = updateCollectionSchema.parse(req.body);
    const result = await collectionsService.updateForWorkspace(
      auth.userId,
      workspaceId,
      collectionId,
      payload,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async remove(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId } =
      workspaceCollectionByIdParamsSchema.parse(req.params);
    await collectionsService.deleteForWorkspace(
      auth.userId,
      workspaceId,
      collectionId,
    );
    appResponse.sendSuccess(res, 200, { deleted: true });
  },

  async listEndpoints(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId } =
      workspaceCollectionByIdParamsSchema.parse(req.params);
    const result = await collectionsService.listEndpointsForCollection(
      auth.userId,
      workspaceId,
      collectionId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async getEndpointById(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, endpointId } =
      workspaceCollectionEndpointByIdParamsSchema.parse(req.params);
    const result = await collectionsService.getEndpointByIdForCollection(
      auth.userId,
      workspaceId,
      collectionId,
      endpointId,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async createEndpoint(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId } =
      workspaceCollectionByIdParamsSchema.parse(req.params);
    const payload = createCollectionEndpointSchema.parse(req.body);
    const result = await collectionsService.createEndpointForCollection(
      auth.userId,
      workspaceId,
      collectionId,
      payload,
    );
    appResponse.sendSuccess(res, 201, result);
  },

  async updateEndpoint(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, endpointId } =
      workspaceCollectionEndpointByIdParamsSchema.parse(req.params);
    const payload = updateCollectionEndpointSchema.parse(req.body);
    const result = await collectionsService.updateEndpointForCollection(
      auth.userId,
      workspaceId,
      collectionId,
      endpointId,
      payload,
    );
    appResponse.sendSuccess(res, 200, result);
  },

  async removeEndpoint(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, endpointId } =
      workspaceCollectionEndpointByIdParamsSchema.parse(req.params);
    await collectionsService.deleteEndpointForCollection(
      auth.userId,
      workspaceId,
      collectionId,
      endpointId,
    );
    appResponse.sendSuccess(res, 200, { deleted: true });
  },
};
