import { z } from "zod";

import {
  createEnvironmentSchema,
  createEnvironmentVariableSchema,
  updateEnvironmentSchema,
  updateEnvironmentVariableSchema,
  workspaceEnvironmentByIdParamsSchema,
  workspaceEnvironmentParamsSchema,
  workspaceEnvironmentVariableByIdParamsSchema,
} from "../../src/modules/environments/environments.schema.js";
import {
  apiActionSuccessSchema,
  apiListSuccessSchema,
  apiObjectSuccessSchema,
  idSchema,
  isoDateTimeStringSchema,
  standardRouteErrors,
  type EndpointContract,
} from "../shared.js";
import { ROUTE_PATTERNS } from "../../src/shared/http/routes.js";

const environmentResponseSchema = z
  .object({
    id: idSchema,
    workspaceId: idSchema,
    name: z.string(),
    createdByUserId: idSchema,
    createdAt: isoDateTimeStringSchema,
    updatedAt: isoDateTimeStringSchema,
  })
  .strict();

const environmentVariableResponseSchema = z
  .object({
    id: idSchema,
    environmentId: idSchema,
    key: z.string(),
    value: z.string(),
    enabled: z.boolean(),
    isSecret: z.boolean(),
    position: z.number().int(),
    createdByUserId: idSchema,
    createdAt: isoDateTimeStringSchema,
    updatedAt: isoDateTimeStringSchema,
  })
  .strict();

const deletedResponseSchema = apiActionSuccessSchema("deleted");

export const environmentContracts: EndpointContract[] = [
  {
    method: "GET",
    path: ROUTE_PATTERNS.environments.list,
    auth: "bearer",
    request: { params: workspaceEnvironmentParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiListSuccessSchema(environmentResponseSchema),
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
    path: ROUTE_PATTERNS.environments.byId,
    auth: "bearer",
    request: { params: workspaceEnvironmentByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiObjectSuccessSchema(environmentResponseSchema),
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
    path: ROUTE_PATTERNS.environments.list,
    auth: "bearer",
    request: {
      params: workspaceEnvironmentParamsSchema,
      body: createEnvironmentSchema,
    },
    responses: {
      success: {
        status: 201,
        schema: apiObjectSuccessSchema(environmentResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
        standardRouteErrors.conflict,
      ],
    },
  },
  {
    method: "PATCH",
    path: ROUTE_PATTERNS.environments.byId,
    auth: "bearer",
    request: {
      params: workspaceEnvironmentByIdParamsSchema,
      body: updateEnvironmentSchema,
    },
    responses: {
      success: {
        status: 200,
        schema: apiObjectSuccessSchema(environmentResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
        standardRouteErrors.conflict,
      ],
    },
  },
  {
    method: "DELETE",
    path: ROUTE_PATTERNS.environments.byId,
    auth: "bearer",
    request: { params: workspaceEnvironmentByIdParamsSchema },
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
    path: ROUTE_PATTERNS.environments.variables,
    auth: "bearer",
    request: { params: workspaceEnvironmentByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiListSuccessSchema(environmentVariableResponseSchema),
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
    path: ROUTE_PATTERNS.environments.variableById,
    auth: "bearer",
    request: { params: workspaceEnvironmentVariableByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiObjectSuccessSchema(environmentVariableResponseSchema),
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
    path: ROUTE_PATTERNS.environments.variables,
    auth: "bearer",
    request: {
      params: workspaceEnvironmentByIdParamsSchema,
      body: createEnvironmentVariableSchema,
    },
    responses: {
      success: {
        status: 201,
        schema: apiObjectSuccessSchema(environmentVariableResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
        standardRouteErrors.conflict,
      ],
    },
  },
  {
    method: "PATCH",
    path: ROUTE_PATTERNS.environments.variableById,
    auth: "bearer",
    request: {
      params: workspaceEnvironmentVariableByIdParamsSchema,
      body: updateEnvironmentVariableSchema,
    },
    responses: {
      success: {
        status: 200,
        schema: apiObjectSuccessSchema(environmentVariableResponseSchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
        standardRouteErrors.conflict,
      ],
    },
  },
  {
    method: "DELETE",
    path: ROUTE_PATTERNS.environments.variableById,
    auth: "bearer",
    request: { params: workspaceEnvironmentVariableByIdParamsSchema },
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
