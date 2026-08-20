import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import { createAppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";

import {
  createCollectionEndpointExampleSchema,
  createCollectionEndpointSchema,
  createCollectionFolderSchema,
  createCollectionSchema,
  updateCollectionEndpointExampleSchema,
  updateCollectionSchema,
  updateCollectionEndpointSchema,
  updateCollectionFolderSchema,
  workspaceCollectionByIdParamsSchema,
  workspaceCollectionEndpointExampleByIdParamsSchema,
  workspaceCollectionEndpointByIdParamsSchema,
  workspaceCollectionFolderByIdParamsSchema,
  workspaceCollectionParamsSchema,
} from "./collections.schema.js";
import { collectionsService } from "./collections.service.js";

const requireAuthContext = (req: Request): NonNullable<Request["auth"]> => {
  if (!req.auth) {
    throw createAppError(ERROR_CODES.common.MISSING_AUTHENTICATED_CONTEXT);
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
    appResponse.sendList(res, 200, result);
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
    appResponse.sendObject(res, 200, result);
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
    appResponse.sendObject(res, 201, result);
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
    appResponse.sendObject(res, 200, result);
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
    appResponse.sendAction(res, 200, "deleted");
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
    appResponse.sendList(res, 200, result);
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
    appResponse.sendObject(res, 200, result);
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
    appResponse.sendObject(res, 201, result);
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
    appResponse.sendObject(res, 200, result);
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
    appResponse.sendAction(res, 200, "deleted");
  },

  async listFolders(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId } =
      workspaceCollectionByIdParamsSchema.parse(req.params);
    const result = await collectionsService.listFoldersForCollection(
      auth.userId,
      workspaceId,
      collectionId,
    );
    appResponse.sendList(res, 200, result);
  },

  async getFolderById(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, folderId } =
      workspaceCollectionFolderByIdParamsSchema.parse(req.params);
    const result = await collectionsService.getFolderByIdForCollection(
      auth.userId,
      workspaceId,
      collectionId,
      folderId,
    );
    appResponse.sendObject(res, 200, result);
  },

  async createFolder(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId } =
      workspaceCollectionByIdParamsSchema.parse(req.params);
    const payload = createCollectionFolderSchema.parse(req.body);
    const result = await collectionsService.createFolderForCollection(
      auth.userId,
      workspaceId,
      collectionId,
      payload,
    );
    appResponse.sendObject(res, 201, result);
  },

  async updateFolder(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, folderId } =
      workspaceCollectionFolderByIdParamsSchema.parse(req.params);
    const payload = updateCollectionFolderSchema.parse(req.body);
    const result = await collectionsService.updateFolderForCollection(
      auth.userId,
      workspaceId,
      collectionId,
      folderId,
      payload,
    );
    appResponse.sendObject(res, 200, result);
  },

  async removeFolder(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, folderId } =
      workspaceCollectionFolderByIdParamsSchema.parse(req.params);
    await collectionsService.deleteFolderForCollection(
      auth.userId,
      workspaceId,
      collectionId,
      folderId,
    );
    appResponse.sendAction(res, 200, "deleted");
  },

  async listEndpointExamples(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, endpointId } =
      workspaceCollectionEndpointByIdParamsSchema.parse(req.params);
    const result = await collectionsService.listExamplesForEndpoint(
      auth.userId,
      workspaceId,
      collectionId,
      endpointId,
    );
    appResponse.sendList(res, 200, result);
  },

  async getEndpointExampleById(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, endpointId, exampleId } =
      workspaceCollectionEndpointExampleByIdParamsSchema.parse(req.params);
    const result = await collectionsService.getExampleByIdForEndpoint(
      auth.userId,
      workspaceId,
      collectionId,
      endpointId,
      exampleId,
    );
    appResponse.sendObject(res, 200, result);
  },

  async createEndpointExample(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, endpointId } =
      workspaceCollectionEndpointByIdParamsSchema.parse(req.params);
    const payload = createCollectionEndpointExampleSchema.parse(req.body);
    const result = await collectionsService.createExampleForEndpoint(
      auth.userId,
      workspaceId,
      collectionId,
      endpointId,
      payload,
    );
    appResponse.sendObject(res, 201, result);
  },

  async updateEndpointExample(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, endpointId, exampleId } =
      workspaceCollectionEndpointExampleByIdParamsSchema.parse(req.params);
    const payload = updateCollectionEndpointExampleSchema.parse(req.body);
    const result = await collectionsService.updateExampleForEndpoint(
      auth.userId,
      workspaceId,
      collectionId,
      endpointId,
      exampleId,
      payload,
    );
    appResponse.sendObject(res, 200, result);
  },

  async removeEndpointExample(req: Request, res: Response): Promise<void> {
    const auth = requireAuthContext(req);
    const { workspaceId, collectionId, endpointId, exampleId } =
      workspaceCollectionEndpointExampleByIdParamsSchema.parse(req.params);
    await collectionsService.deleteExampleForEndpoint(
      auth.userId,
      workspaceId,
      collectionId,
      endpointId,
      exampleId,
    );
    appResponse.sendAction(res, 200, "deleted");
  },
};
