import type { ZodOpenApiPathsObject } from "zod-openapi";

import {
  createEnvironmentSchema,
  createEnvironmentVariableSchema,
  updateEnvironmentSchema,
  updateEnvironmentVariableSchema,
  workspaceEnvironmentByIdParamsSchema,
  workspaceEnvironmentParamsSchema,
  workspaceEnvironmentVariableByIdParamsSchema,
} from "../../modules/environments/schema.js";
import { ROUTE_PATTERNS } from "../../shared/routes.js";
import {
  environmentSchema,
  environmentVariableSchema,
} from "../schemas/environments.js";
import {
  BEARER_AUTH,
  actionConfirmationSchema,
  listEnvelope,
  successEnvelope,
  withErrors,
} from "../schemas/common.js";

const auth = [{ [BEARER_AUTH]: [] }];

export const environmentsPaths: ZodOpenApiPathsObject = {
  [ROUTE_PATTERNS.environments.list]: {
    get: {
      tags: ["Environments"],
      summary: "List environments in a workspace",
      security: auth,
      requestParams: { path: workspaceEnvironmentParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Environment list",
            content: {
              "application/json": { schema: listEnvelope(environmentSchema) },
            },
          },
        },
        ["401", "403"],
      ),
    },
    post: {
      tags: ["Environments"],
      summary: "Create an environment",
      security: auth,
      requestParams: { path: workspaceEnvironmentParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: createEnvironmentSchema,
            example: { name: "Production" },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Environment created",
            content: {
              "application/json": {
                schema: successEnvelope(environmentSchema),
              },
            },
          },
        },
        ["400", "401", "403", "409"],
      ),
    },
  },
  [ROUTE_PATTERNS.environments.byId]: {
    get: {
      tags: ["Environments"],
      summary: "Get an environment by id",
      security: auth,
      requestParams: { path: workspaceEnvironmentByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Environment",
            content: {
              "application/json": {
                schema: successEnvelope(environmentSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    patch: {
      tags: ["Environments"],
      summary: "Update an environment",
      security: auth,
      requestParams: { path: workspaceEnvironmentByIdParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: updateEnvironmentSchema,
            example: { name: "Staging" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Environment updated",
            content: {
              "application/json": {
                schema: successEnvelope(environmentSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404", "409"],
      ),
    },
    delete: {
      tags: ["Environments"],
      summary: "Delete an environment",
      security: auth,
      requestParams: { path: workspaceEnvironmentByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Environment deleted",
            content: {
              "application/json": { schema: actionConfirmationSchema },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
  },
  [ROUTE_PATTERNS.environments.variables]: {
    get: {
      tags: ["Environments"],
      summary: "List variables in an environment",
      security: auth,
      requestParams: { path: workspaceEnvironmentByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Variable list",
            content: {
              "application/json": {
                schema: listEnvelope(environmentVariableSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    post: {
      tags: ["Environments"],
      summary: "Create a variable in an environment",
      security: auth,
      requestParams: { path: workspaceEnvironmentByIdParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: createEnvironmentVariableSchema,
            example: { key: "API_BASE_URL", value: "https://api.example.com" },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Variable created",
            content: {
              "application/json": {
                schema: successEnvelope(environmentVariableSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404", "409"],
      ),
    },
  },
  [ROUTE_PATTERNS.environments.variableById]: {
    get: {
      tags: ["Environments"],
      summary: "Get a variable by id",
      security: auth,
      requestParams: { path: workspaceEnvironmentVariableByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Variable",
            content: {
              "application/json": {
                schema: successEnvelope(environmentVariableSchema),
              },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
    patch: {
      tags: ["Environments"],
      summary: "Update a variable",
      security: auth,
      requestParams: { path: workspaceEnvironmentVariableByIdParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: updateEnvironmentVariableSchema,
            example: { value: "https://api.staging.example.com" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Variable updated",
            content: {
              "application/json": {
                schema: successEnvelope(environmentVariableSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404", "409"],
      ),
    },
    delete: {
      tags: ["Environments"],
      summary: "Delete a variable",
      security: auth,
      requestParams: { path: workspaceEnvironmentVariableByIdParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Variable deleted",
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
