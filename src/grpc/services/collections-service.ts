import type {
  ServiceDefinition,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";

import {
  createCollectionEndpointExampleSchema,
  createCollectionEndpointSchema,
  createCollectionFolderSchema,
  createCollectionSchema,
  updateCollectionEndpointExampleSchema,
  updateCollectionEndpointSchema,
  updateCollectionFolderSchema,
  updateCollectionSchema,
  workspaceCollectionByIdParamsSchema,
  workspaceCollectionEndpointByIdParamsSchema,
  workspaceCollectionEndpointExampleByIdParamsSchema,
  workspaceCollectionFolderByIdParamsSchema,
  workspaceCollectionParamsSchema,
} from "../../modules/collections/collections.schema.js";
import { collectionsService } from "../../modules/collections/collections.service.js";
import { withUnaryContext } from "../interceptors/unary-context.js";
import {
  toGrpcCollectionEndpointItem,
  toGrpcCollectionExampleItem,
  toGrpcCollectionFolderItem,
  toGrpcCollectionItem,
} from "../mappers/collections.js";

type CollectionsServiceDefinition = {
  service: ServiceDefinition<UntypedServiceImplementation>;
};

type ServiceRoot = {
  role: {
    v1: {
      CollectionsService: CollectionsServiceDefinition;
    };
  };
};

const parseJsonPayload = <T>(value: string, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const addCollectionsGrpcService = (root: ServiceRoot) => {
  return {
    service: root.role.v1.CollectionsService.service,
    implementation: {
      List: withUnaryContext<{ workspace_id: number }, { items: unknown[] }>(
        "CollectionsService.List",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId } = workspaceCollectionParamsSchema.parse({
              workspaceId: call.request.workspace_id,
            });
            const result = await collectionsService.listForWorkspace(
              context.auth!.userId,
              workspaceId,
            );
            return { items: result.map(toGrpcCollectionItem) };
          },
        },
      ),
      GetById: withUnaryContext<
        { workspace_id: number; collection_id: number },
        { item: unknown }
      >("CollectionsService.GetById", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId } =
            workspaceCollectionByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
            });
          const result = await collectionsService.getByIdForWorkspace(
            context.auth!.userId,
            workspaceId,
            collectionId,
          );
          return { item: toGrpcCollectionItem(result) };
        },
      }),
      Create: withUnaryContext<
        { workspace_id: number; name: string; description: string },
        { item: unknown }
      >("CollectionsService.Create", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId } = workspaceCollectionParamsSchema.parse({
            workspaceId: call.request.workspace_id,
          });
          const payload = createCollectionSchema.parse({
            name: call.request.name,
            ...(call.request.description
              ? { description: call.request.description }
              : {}),
          });
          const result = await collectionsService.createForWorkspace(
            context.auth!.userId,
            workspaceId,
            payload,
          );
          return { item: toGrpcCollectionItem(result) };
        },
      }),
      Update: withUnaryContext<
        {
          workspace_id: number;
          collection_id: number;
          name: string;
          description: string;
        },
        { item: unknown }
      >("CollectionsService.Update", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId } =
            workspaceCollectionByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
            });
          const payload = updateCollectionSchema.parse({
            ...(call.request.name ? { name: call.request.name } : {}),
            ...(call.request.description
              ? { description: call.request.description }
              : {}),
          });
          const result = await collectionsService.updateForWorkspace(
            context.auth!.userId,
            workspaceId,
            collectionId,
            payload,
          );
          return { item: toGrpcCollectionItem(result) };
        },
      }),
      Delete: withUnaryContext<
        { workspace_id: number; collection_id: number },
        { status: string }
      >("CollectionsService.Delete", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId } =
            workspaceCollectionByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
            });
          await collectionsService.deleteForWorkspace(
            context.auth!.userId,
            workspaceId,
            collectionId,
          );
          return { status: "deleted" };
        },
      }),
      ListEndpoints: withUnaryContext<
        { workspace_id: number; collection_id: number },
        { items: unknown[] }
      >("CollectionsService.ListEndpoints", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId } =
            workspaceCollectionByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
            });
          const result = await collectionsService.listEndpointsForCollection(
            context.auth!.userId,
            workspaceId,
            collectionId,
          );
          return { items: result.map(toGrpcCollectionEndpointItem) };
        },
      }),
      GetEndpointById: withUnaryContext<
        { workspace_id: number; collection_id: number; endpoint_id: number },
        { item: unknown }
      >("CollectionsService.GetEndpointById", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId, endpointId } =
            workspaceCollectionEndpointByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
              endpointId: call.request.endpoint_id,
            });
          const result = await collectionsService.getEndpointByIdForCollection(
            context.auth!.userId,
            workspaceId,
            collectionId,
            endpointId,
          );
          return { item: toGrpcCollectionEndpointItem(result) };
        },
      }),
      CreateEndpoint: withUnaryContext<any, { item: unknown }>(
        "CollectionsService.CreateEndpoint",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId, collectionId } =
              workspaceCollectionByIdParamsSchema.parse({
                workspaceId: call.request.workspace_id,
                collectionId: call.request.collection_id,
              });
            const payload = createCollectionEndpointSchema.parse({
              folderId: call.request.folder_id || undefined,
              name: call.request.name,
              method: call.request.method,
              url: call.request.url,
              headers: parseJsonPayload(call.request.headers_json, []),
              queryParams: parseJsonPayload(call.request.query_params_json, []),
              body: call.request.body_json
                ? parseJsonPayload(call.request.body_json, null)
                : undefined,
              auth: call.request.auth_json
                ? parseJsonPayload(call.request.auth_json, null)
                : undefined,
              position: call.request.position || undefined,
            });
            const result = await collectionsService.createEndpointForCollection(
              context.auth!.userId,
              workspaceId,
              collectionId,
              payload,
            );
            return { item: toGrpcCollectionEndpointItem(result) };
          },
        },
      ),
      UpdateEndpoint: withUnaryContext<any, { item: unknown }>(
        "CollectionsService.UpdateEndpoint",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId, collectionId, endpointId } =
              workspaceCollectionEndpointByIdParamsSchema.parse({
                workspaceId: call.request.workspace_id,
                collectionId: call.request.collection_id,
                endpointId: call.request.endpoint_id,
              });
            const payload = updateCollectionEndpointSchema.parse({
              ...(call.request.folder_id
                ? { folderId: call.request.folder_id }
                : {}),
              ...(call.request.name ? { name: call.request.name } : {}),
              ...(call.request.method ? { method: call.request.method } : {}),
              ...(call.request.url ? { url: call.request.url } : {}),
              ...(call.request.headers_json
                ? { headers: parseJsonPayload(call.request.headers_json, []) }
                : {}),
              ...(call.request.query_params_json
                ? {
                    queryParams: parseJsonPayload(
                      call.request.query_params_json,
                      [],
                    ),
                  }
                : {}),
              ...(call.request.body_json
                ? { body: parseJsonPayload(call.request.body_json, null) }
                : {}),
              ...(call.request.auth_json
                ? { auth: parseJsonPayload(call.request.auth_json, null) }
                : {}),
              ...(call.request.position
                ? { position: call.request.position }
                : {}),
            });
            const result = await collectionsService.updateEndpointForCollection(
              context.auth!.userId,
              workspaceId,
              collectionId,
              endpointId,
              payload,
            );
            return { item: toGrpcCollectionEndpointItem(result) };
          },
        },
      ),
      DeleteEndpoint: withUnaryContext<
        { workspace_id: number; collection_id: number; endpoint_id: number },
        { status: string }
      >("CollectionsService.DeleteEndpoint", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId, endpointId } =
            workspaceCollectionEndpointByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
              endpointId: call.request.endpoint_id,
            });
          await collectionsService.deleteEndpointForCollection(
            context.auth!.userId,
            workspaceId,
            collectionId,
            endpointId,
          );
          return { status: "deleted" };
        },
      }),
      ListFolders: withUnaryContext<
        { workspace_id: number; collection_id: number },
        { items: unknown[] }
      >("CollectionsService.ListFolders", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId } =
            workspaceCollectionByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
            });
          const result = await collectionsService.listFoldersForCollection(
            context.auth!.userId,
            workspaceId,
            collectionId,
          );
          return { items: result.map(toGrpcCollectionFolderItem) };
        },
      }),
      CreateFolder: withUnaryContext<any, { item: unknown }>(
        "CollectionsService.CreateFolder",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId, collectionId } =
              workspaceCollectionByIdParamsSchema.parse({
                workspaceId: call.request.workspace_id,
                collectionId: call.request.collection_id,
              });
            const payload = createCollectionFolderSchema.parse({
              name: call.request.name,
              ...(call.request.parent_folder_id
                ? { parentFolderId: call.request.parent_folder_id }
                : {}),
              ...(call.request.position
                ? { position: call.request.position }
                : {}),
            });
            const result = await collectionsService.createFolderForCollection(
              context.auth!.userId,
              workspaceId,
              collectionId,
              payload,
            );
            return { item: toGrpcCollectionFolderItem(result) };
          },
        },
      ),
      UpdateFolder: withUnaryContext<any, { item: unknown }>(
        "CollectionsService.UpdateFolder",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId, collectionId, folderId } =
              workspaceCollectionFolderByIdParamsSchema.parse({
                workspaceId: call.request.workspace_id,
                collectionId: call.request.collection_id,
                folderId: call.request.folder_id,
              });
            const payload = updateCollectionFolderSchema.parse({
              ...(call.request.name ? { name: call.request.name } : {}),
              ...(call.request.parent_folder_id
                ? { parentFolderId: call.request.parent_folder_id }
                : {}),
              ...(call.request.position
                ? { position: call.request.position }
                : {}),
            });
            const result = await collectionsService.updateFolderForCollection(
              context.auth!.userId,
              workspaceId,
              collectionId,
              folderId,
              payload,
            );
            return { item: toGrpcCollectionFolderItem(result) };
          },
        },
      ),
      DeleteFolder: withUnaryContext<
        { workspace_id: number; collection_id: number; folder_id: number },
        { status: string }
      >("CollectionsService.DeleteFolder", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId, folderId } =
            workspaceCollectionFolderByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
              folderId: call.request.folder_id,
            });
          await collectionsService.deleteFolderForCollection(
            context.auth!.userId,
            workspaceId,
            collectionId,
            folderId,
          );
          return { status: "deleted" };
        },
      }),
      ListEndpointExamples: withUnaryContext<
        { workspace_id: number; collection_id: number; endpoint_id: number },
        { items: unknown[] }
      >("CollectionsService.ListEndpointExamples", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId, endpointId } =
            workspaceCollectionEndpointByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
              endpointId: call.request.endpoint_id,
            });
          const result = await collectionsService.listExamplesForEndpoint(
            context.auth!.userId,
            workspaceId,
            collectionId,
            endpointId,
          );
          return { items: result.map(toGrpcCollectionExampleItem) };
        },
      }),
      CreateEndpointExample: withUnaryContext<any, { item: unknown }>(
        "CollectionsService.CreateEndpointExample",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId, collectionId, endpointId } =
              workspaceCollectionEndpointByIdParamsSchema.parse({
                workspaceId: call.request.workspace_id,
                collectionId: call.request.collection_id,
                endpointId: call.request.endpoint_id,
              });
            const payload = createCollectionEndpointExampleSchema.parse({
              name: call.request.name,
              ...(call.request.status_code
                ? { statusCode: call.request.status_code }
                : {}),
              ...(call.request.headers_json
                ? { headers: parseJsonPayload(call.request.headers_json, []) }
                : {}),
              ...(call.request.body ? { body: call.request.body } : {}),
              ...(call.request.position
                ? { position: call.request.position }
                : {}),
            });
            const result = await collectionsService.createExampleForEndpoint(
              context.auth!.userId,
              workspaceId,
              collectionId,
              endpointId,
              payload,
            );
            return { item: toGrpcCollectionExampleItem(result) };
          },
        },
      ),
      UpdateEndpointExample: withUnaryContext<any, { item: unknown }>(
        "CollectionsService.UpdateEndpointExample",
        {
          requireAuth: true,
          handler: async (call, context) => {
            const { workspaceId, collectionId, endpointId, exampleId } =
              workspaceCollectionEndpointExampleByIdParamsSchema.parse({
                workspaceId: call.request.workspace_id,
                collectionId: call.request.collection_id,
                endpointId: call.request.endpoint_id,
                exampleId: call.request.example_id,
              });
            const payload = updateCollectionEndpointExampleSchema.parse({
              ...(call.request.name ? { name: call.request.name } : {}),
              ...(call.request.status_code
                ? { statusCode: call.request.status_code }
                : {}),
              ...(call.request.headers_json
                ? { headers: parseJsonPayload(call.request.headers_json, []) }
                : {}),
              ...(call.request.body ? { body: call.request.body } : {}),
              ...(call.request.position
                ? { position: call.request.position }
                : {}),
            });
            const result = await collectionsService.updateExampleForEndpoint(
              context.auth!.userId,
              workspaceId,
              collectionId,
              endpointId,
              exampleId,
              payload,
            );
            return { item: toGrpcCollectionExampleItem(result) };
          },
        },
      ),
      DeleteEndpointExample: withUnaryContext<
        {
          workspace_id: number;
          collection_id: number;
          endpoint_id: number;
          example_id: number;
        },
        { status: string }
      >("CollectionsService.DeleteEndpointExample", {
        requireAuth: true,
        handler: async (call, context) => {
          const { workspaceId, collectionId, endpointId, exampleId } =
            workspaceCollectionEndpointExampleByIdParamsSchema.parse({
              workspaceId: call.request.workspace_id,
              collectionId: call.request.collection_id,
              endpointId: call.request.endpoint_id,
              exampleId: call.request.example_id,
            });
          await collectionsService.deleteExampleForEndpoint(
            context.auth!.userId,
            workspaceId,
            collectionId,
            endpointId,
            exampleId,
          );
          return { status: "deleted" };
        },
      }),
    } as UntypedServiceImplementation,
  };
};
