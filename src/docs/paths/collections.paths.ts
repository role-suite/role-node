import type { ZodOpenApiPathsObject } from "zod-openapi";

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
} from "../../modules/collections/schema.js";
import { ROUTE_PATTERNS } from "../../shared/routes.js";
import {
  collectionEndpointExampleSchema,
  collectionEndpointSchema,
  collectionFolderSchema,
  collectionSchema,
} from "../schemas/collections.js";
import {
  BEARER_AUTH,
  actionConfirmationSchema,
  listEnvelope,
  successEnvelope,
  withErrors,
} from "../schemas/common.js";

const auth = [{ [BEARER_AUTH]: [] }];

export const collectionsPaths: ZodOpenApiPathsObject = {
  [ROUTE_PATTERNS.collections.list]: {
    get: {
      tags: ["Collections"],
      summary: "List collections in a workspace",
      security: auth,
      requestParams: { path: workspaceCollectionParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Collection list",
            content: {
              "application/json": { schema: listEnvelope(collectionSchema) },
            },
          },
        },
        ["401", "403"],
      ),
    },
    post: {
      tags: ["Collections"],
      summary: "Create a collection",
      security: auth,
      requestParams: { path: workspaceCollectionParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: createCollectionSchema,
            example: {
              name: "Orders API",
              description: "Collection for orders endpoints",
            },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Collection created",
            content: {
              "application/json": { schema: successEnvelope(collectionSchema) },
            },
          },
        },
        ["400", "401", "403"],
      ),
    },
  },
  [ROUTE_PATTERNS.collections.byId]: {
    get: {
      tags: ["Collections"],
      summary: "Get a collection by id",
      security: auth,
      requestParams: { path: workspaceCollectionByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Collection",
            content: {
              "application/json": { schema: successEnvelope(collectionSchema) },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    patch: {
      tags: ["Collections"],
      summary: "Update a collection",
      security: auth,
      requestParams: { path: workspaceCollectionByIdParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: updateCollectionSchema,
            example: { name: "Orders API v2" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Collection updated",
            content: {
              "application/json": { schema: successEnvelope(collectionSchema) },
            },
          },
        },
        ["400", "401", "403", "404"],
      ),
    },
    delete: {
      tags: ["Collections"],
      summary: "Delete a collection",
      security: auth,
      requestParams: { path: workspaceCollectionByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Collection deleted",
            content: {
              "application/json": { schema: actionConfirmationSchema },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
  },
  [ROUTE_PATTERNS.collections.endpoints]: {
    get: {
      tags: ["Collections"],
      summary: "List endpoints in a collection",
      security: auth,
      requestParams: { path: workspaceCollectionByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Endpoint list",
            content: {
              "application/json": {
                schema: listEnvelope(collectionEndpointSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    post: {
      tags: ["Collections"],
      summary: "Create an endpoint in a collection",
      security: auth,
      requestParams: { path: workspaceCollectionByIdParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: createCollectionEndpointSchema,
            example: {
              name: "Get Orders",
              method: "GET",
              url: "https://api.example.com/orders",
              headers: [{ key: "Accept", value: "application/json" }],
              queryParams: [{ key: "limit", value: "20" }],
              body: { mode: "raw", contentType: "application/json", raw: "{}" },
              auth: { type: "none" },
            },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Endpoint created",
            content: {
              "application/json": {
                schema: successEnvelope(collectionEndpointSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404"],
      ),
    },
  },
  [ROUTE_PATTERNS.collections.endpointById]: {
    get: {
      tags: ["Collections"],
      summary: "Get an endpoint by id",
      security: auth,
      requestParams: { path: workspaceCollectionEndpointByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Endpoint",
            content: {
              "application/json": {
                schema: successEnvelope(collectionEndpointSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    patch: {
      tags: ["Collections"],
      summary: "Update an endpoint",
      security: auth,
      requestParams: { path: workspaceCollectionEndpointByIdParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: updateCollectionEndpointSchema,
            example: { url: "https://api.example.com/v2/orders" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Endpoint updated",
            content: {
              "application/json": {
                schema: successEnvelope(collectionEndpointSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404"],
      ),
    },
    delete: {
      tags: ["Collections"],
      summary: "Delete an endpoint",
      security: auth,
      requestParams: { path: workspaceCollectionEndpointByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Endpoint deleted",
            content: {
              "application/json": { schema: actionConfirmationSchema },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
  },
  [ROUTE_PATTERNS.collections.folders]: {
    get: {
      tags: ["Collections"],
      summary: "List folders in a collection",
      security: auth,
      requestParams: { path: workspaceCollectionByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Folder list",
            content: {
              "application/json": {
                schema: listEnvelope(collectionFolderSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    post: {
      tags: ["Collections"],
      summary: "Create a folder in a collection",
      security: auth,
      requestParams: { path: workspaceCollectionByIdParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: createCollectionFolderSchema,
            example: { name: "Order management" },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Folder created",
            content: {
              "application/json": {
                schema: successEnvelope(collectionFolderSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404"],
      ),
    },
  },
  [ROUTE_PATTERNS.collections.folderById]: {
    get: {
      tags: ["Collections"],
      summary: "Get a folder by id",
      security: auth,
      requestParams: { path: workspaceCollectionFolderByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Folder",
            content: {
              "application/json": {
                schema: successEnvelope(collectionFolderSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    patch: {
      tags: ["Collections"],
      summary: "Update a folder",
      security: auth,
      requestParams: { path: workspaceCollectionFolderByIdParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: updateCollectionFolderSchema,
            example: { name: "Order management v2" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Folder updated",
            content: {
              "application/json": {
                schema: successEnvelope(collectionFolderSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404"],
      ),
    },
    delete: {
      tags: ["Collections"],
      summary: "Delete a folder",
      security: auth,
      requestParams: { path: workspaceCollectionFolderByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Folder deleted",
            content: {
              "application/json": { schema: actionConfirmationSchema },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
  },
  [ROUTE_PATTERNS.collections.endpointExamples]: {
    get: {
      tags: ["Collections"],
      summary: "List saved response examples for an endpoint",
      security: auth,
      requestParams: { path: workspaceCollectionEndpointByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Example list",
            content: {
              "application/json": {
                schema: listEnvelope(collectionEndpointExampleSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    post: {
      tags: ["Collections"],
      summary: "Create a saved response example for an endpoint",
      security: auth,
      requestParams: { path: workspaceCollectionEndpointByIdParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: createCollectionEndpointExampleSchema,
            example: {
              name: "200 OK - one order",
              statusCode: 200,
              headers: [{ key: "Content-Type", value: "application/json" }],
              body: '{"id":1,"status":"pending"}',
            },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Example created",
            content: {
              "application/json": {
                schema: successEnvelope(collectionEndpointExampleSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404"],
      ),
    },
  },
  [ROUTE_PATTERNS.collections.endpointExampleById]: {
    get: {
      tags: ["Collections"],
      summary: "Get a saved response example by id",
      security: auth,
      requestParams: {
        path: workspaceCollectionEndpointExampleByIdParamsSchema,
      },
      responses: withErrors(
        {
          "200": {
            description: "Example",
            content: {
              "application/json": {
                schema: successEnvelope(collectionEndpointExampleSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    patch: {
      tags: ["Collections"],
      summary: "Update a saved response example",
      security: auth,
      requestParams: {
        path: workspaceCollectionEndpointExampleByIdParamsSchema,
      },
      requestBody: {
        content: {
          "application/json": {
            schema: updateCollectionEndpointExampleSchema,
            example: { statusCode: 404 },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Example updated",
            content: {
              "application/json": {
                schema: successEnvelope(collectionEndpointExampleSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404"],
      ),
    },
    delete: {
      tags: ["Collections"],
      summary: "Delete a saved response example",
      security: auth,
      requestParams: {
        path: workspaceCollectionEndpointExampleByIdParamsSchema,
      },
      responses: withErrors(
        {
          "200": {
            description: "Example deleted",
            content: {
              "application/json": { schema: actionConfirmationSchema },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
  },
};
