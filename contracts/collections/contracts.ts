import { z } from "zod";

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
} from "../../src/modules/collections/collections.schema.js";
import {
  apiSuccessSchema,
  idSchema,
  isoDateTimeStringSchema,
  standardRouteErrors,
  type EndpointContract,
} from "../shared.js";

const endpointKeyValueSchema = z
  .object({
    key: z.string(),
    value: z.string(),
    enabled: z.boolean().optional(),
  })
  .strict();

const endpointBodySchema = z.union([
  z
    .object({
      mode: z.literal("raw"),
      contentType: z.string().optional(),
      raw: z.string(),
    })
    .strict(),
  z
    .object({
      mode: z.literal("urlencoded"),
      entries: z.array(endpointKeyValueSchema),
    })
    .strict(),
  z
    .object({
      mode: z.literal("formdata"),
      entries: z.array(
        z.discriminatedUnion("type", [
          z
            .object({
              type: z.literal("text"),
              key: z.string(),
              value: z.string(),
              enabled: z.boolean().optional(),
            })
            .strict(),
          z
            .object({
              type: z.literal("file"),
              key: z.string(),
              fileName: z.string(),
              contentType: z.string().optional(),
              dataBase64: z.string(),
              enabled: z.boolean().optional(),
            })
            .strict(),
        ]),
      ),
    })
    .strict(),
  z
    .object({
      mode: z.literal("binary"),
      fileName: z.string(),
      contentType: z.string().optional(),
      dataBase64: z.string(),
    })
    .strict(),
  z.object({ mode: z.literal("none") }).strict(),
]);

const endpointAuthSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("none") }).strict(),
  z.object({ type: z.literal("bearer"), token: z.string() }).strict(),
  z
    .object({
      type: z.literal("basic"),
      username: z.string(),
      password: z.string(),
    })
    .strict(),
]);

const collectionResponseSchema = z
  .object({
    id: idSchema,
    _id: idSchema,
    workspaceId: idSchema,
    name: z.string(),
    description: z.string().nullable(),
    createdByUserId: idSchema,
    createdAt: isoDateTimeStringSchema,
    updatedAt: isoDateTimeStringSchema,
  })
  .strict();

const collectionEndpointResponseSchema = z
  .object({
    id: idSchema,
    collectionId: idSchema,
    folderId: idSchema.nullable(),
    name: z.string(),
    method: z.enum([
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "OPTIONS",
    ]),
    url: z.string(),
    headers: z.array(endpointKeyValueSchema),
    queryParams: z.array(endpointKeyValueSchema),
    body: endpointBodySchema.nullable(),
    auth: endpointAuthSchema.nullable(),
    position: z.number().int(),
    createdByUserId: idSchema,
    createdAt: isoDateTimeStringSchema,
    updatedAt: isoDateTimeStringSchema,
  })
  .strict();

const collectionFolderResponseSchema = z
  .object({
    id: idSchema,
    collectionId: idSchema,
    parentFolderId: idSchema.nullable(),
    name: z.string(),
    position: z.number().int(),
    createdByUserId: idSchema,
    createdAt: isoDateTimeStringSchema,
    updatedAt: isoDateTimeStringSchema,
  })
  .strict();

const collectionExampleResponseSchema = z
  .object({
    id: idSchema,
    endpointId: idSchema,
    name: z.string(),
    statusCode: z.number().int(),
    headers: z.array(endpointKeyValueSchema),
    body: z.string().nullable(),
    position: z.number().int(),
    createdByUserId: idSchema,
    createdAt: isoDateTimeStringSchema,
    updatedAt: isoDateTimeStringSchema,
  })
  .strict();

const deletedResponseSchema = apiSuccessSchema(
  z.object({ deleted: z.literal(true) }).strict(),
);

export const collectionContracts: EndpointContract[] = [
  {
    method: "GET",
    path: "/api/workspaces/:workspaceId/collections",
    auth: "bearer",
    request: { params: workspaceCollectionParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(collectionResponseSchema)),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "GET",
    path: "/api/workspaces/:workspaceId/collections/:collectionId",
    auth: "bearer",
    request: { params: workspaceCollectionByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(collectionResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "POST",
    path: "/api/workspaces/:workspaceId/collections",
    auth: "bearer",
    request: {
      params: workspaceCollectionParamsSchema,
      body: createCollectionSchema,
    },
    responses: {
      success: {
        status: 201,
        schema: apiSuccessSchema(collectionResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "PATCH",
    path: "/api/workspaces/:workspaceId/collections/:collectionId",
    auth: "bearer",
    request: {
      params: workspaceCollectionByIdParamsSchema,
      body: updateCollectionSchema,
    },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(collectionResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "DELETE",
    path: "/api/workspaces/:workspaceId/collections/:collectionId",
    auth: "bearer",
    request: { params: workspaceCollectionByIdParamsSchema },
    responses: {
      success: { status: 200, schema: deletedResponseSchema },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "GET",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/endpoints",
    auth: "bearer",
    request: { params: workspaceCollectionByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(collectionEndpointResponseSchema)),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "GET",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId",
    auth: "bearer",
    request: { params: workspaceCollectionEndpointByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(collectionEndpointResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "POST",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/endpoints",
    auth: "bearer",
    request: {
      params: workspaceCollectionByIdParamsSchema,
      body: createCollectionEndpointSchema,
    },
    responses: {
      success: {
        status: 201,
        schema: apiSuccessSchema(collectionEndpointResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "PATCH",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId",
    auth: "bearer",
    request: {
      params: workspaceCollectionEndpointByIdParamsSchema,
      body: updateCollectionEndpointSchema,
    },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(collectionEndpointResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "DELETE",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId",
    auth: "bearer",
    request: { params: workspaceCollectionEndpointByIdParamsSchema },
    responses: {
      success: { status: 200, schema: deletedResponseSchema },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "GET",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples",
    auth: "bearer",
    request: { params: workspaceCollectionEndpointByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(collectionExampleResponseSchema)),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "POST",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples",
    auth: "bearer",
    request: {
      params: workspaceCollectionEndpointByIdParamsSchema,
      body: createCollectionEndpointExampleSchema,
    },
    responses: {
      success: {
        status: 201,
        schema: apiSuccessSchema(collectionExampleResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "PATCH",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId",
    auth: "bearer",
    request: {
      params: workspaceCollectionEndpointExampleByIdParamsSchema,
      body: updateCollectionEndpointExampleSchema,
    },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(collectionExampleResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "DELETE",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId",
    auth: "bearer",
    request: { params: workspaceCollectionEndpointExampleByIdParamsSchema },
    responses: {
      success: { status: 200, schema: deletedResponseSchema },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "GET",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/folders",
    auth: "bearer",
    request: { params: workspaceCollectionByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(collectionFolderResponseSchema)),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "POST",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/folders",
    auth: "bearer",
    request: {
      params: workspaceCollectionByIdParamsSchema,
      body: createCollectionFolderSchema,
    },
    responses: {
      success: {
        status: 201,
        schema: apiSuccessSchema(collectionFolderResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "PATCH",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/folders/:folderId",
    auth: "bearer",
    request: {
      params: workspaceCollectionFolderByIdParamsSchema,
      body: updateCollectionFolderSchema,
    },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(collectionFolderResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "DELETE",
    path: "/api/workspaces/:workspaceId/collections/:collectionId/folders/:folderId",
    auth: "bearer",
    request: { params: workspaceCollectionFolderByIdParamsSchema },
    responses: {
      success: { status: 200, schema: deletedResponseSchema },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
];
