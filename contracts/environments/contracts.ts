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
  apiSuccessSchema,
  idSchema,
  isoDateTimeStringSchema,
  standardRouteErrors,
  type EndpointContract,
} from "../shared.js";

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

const deletedResponseSchema = apiSuccessSchema(
  z.object({ deleted: z.literal(true) }).strict(),
);

export const environmentContracts: EndpointContract[] = [
  {
    method: "GET",
    path: "/api/workspaces/:workspaceId/environments",
    auth: "bearer",
    request: { params: workspaceEnvironmentParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(environmentResponseSchema)),
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
    path: "/api/workspaces/:workspaceId/environments/:environmentId",
    auth: "bearer",
    request: { params: workspaceEnvironmentByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(environmentResponseSchema),
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
    path: "/api/workspaces/:workspaceId/environments",
    auth: "bearer",
    request: {
      params: workspaceEnvironmentParamsSchema,
      body: createEnvironmentSchema,
    },
    responses: {
      success: {
        status: 201,
        schema: apiSuccessSchema(environmentResponseSchema),
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
    path: "/api/workspaces/:workspaceId/environments/:environmentId",
    auth: "bearer",
    request: {
      params: workspaceEnvironmentByIdParamsSchema,
      body: updateEnvironmentSchema,
    },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(environmentResponseSchema),
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
    path: "/api/workspaces/:workspaceId/environments/:environmentId",
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
    path: "/api/workspaces/:workspaceId/environments/:environmentId/variables",
    auth: "bearer",
    request: { params: workspaceEnvironmentByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(environmentVariableResponseSchema)),
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
    path: "/api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId",
    auth: "bearer",
    request: { params: workspaceEnvironmentVariableByIdParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(environmentVariableResponseSchema),
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
    path: "/api/workspaces/:workspaceId/environments/:environmentId/variables",
    auth: "bearer",
    request: {
      params: workspaceEnvironmentByIdParamsSchema,
      body: createEnvironmentVariableSchema,
    },
    responses: {
      success: {
        status: 201,
        schema: apiSuccessSchema(environmentVariableResponseSchema),
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
    path: "/api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId",
    auth: "bearer",
    request: {
      params: workspaceEnvironmentVariableByIdParamsSchema,
      body: updateEnvironmentVariableSchema,
    },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(environmentVariableResponseSchema),
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
    path: "/api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId",
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
