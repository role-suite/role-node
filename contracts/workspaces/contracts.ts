import { z } from "zod";

import {
  acceptWorkspaceInvitationSchema,
  addWorkspaceMemberSchema,
  convertWorkspaceToTeamSchema,
  createWorkspaceInvitationSchema,
  createWorkspaceSchema,
  updateWorkspaceMemberRoleSchema,
  workspaceIdSchema,
  workspaceMemberParamsSchema,
  workspaceUpdatesQuerySchema,
} from "../../src/modules/workspaces/workspaces.schema.js";
import {
  apiErrorSchema,
  apiSuccessSchema,
  idSchema,
  isoDateTimeStringSchema,
  standardRouteErrors,
  type EndpointContract,
  workspaceMemberSchema,
  workspaceSummarySchema,
} from "../shared.js";
import { ROUTE_PATTERNS } from "../../src/shared/http/routes.js";

const invitationResponseSchema = z
  .object({
    id: idSchema,
    workspaceId: idSchema,
    email: z.string().email(),
    role: z.enum(["admin", "member"]),
    token: z.string(),
    expiresAt: isoDateTimeStringSchema,
  })
  .strict();

const workspaceEventSchema = z
  .object({
    id: idSchema,
    workspaceId: idSchema,
    actorUserId: idSchema.nullable(),
    entity: z.string(),
    action: z.string(),
    entityId: idSchema,
    payload: z.record(z.string(), z.unknown()).nullable(),
    createdAt: isoDateTimeStringSchema,
  })
  .strict();

export const workspaceContracts: EndpointContract[] = [
  {
    method: "GET",
    path: ROUTE_PATTERNS.workspaces.list,
    auth: "bearer",
    request: {},
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(workspaceSummarySchema)),
      },
      errors: [
        standardRouteErrors.missingAccessToken,
        standardRouteErrors.invalidAccessToken,
      ],
    },
  },
  {
    method: "GET",
    path: ROUTE_PATTERNS.workspaces.byId,
    auth: "bearer",
    request: { params: workspaceIdSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(workspaceSummarySchema),
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
    path: ROUTE_PATTERNS.workspaces.create,
    auth: "bearer",
    request: { body: createWorkspaceSchema },
    responses: {
      success: {
        status: 201,
        schema: apiSuccessSchema(workspaceSummarySchema),
      },
      errors: [standardRouteErrors.validationFailed],
    },
  },
  {
    method: "GET",
    path: ROUTE_PATTERNS.workspaces.members,
    auth: "bearer",
    request: { params: workspaceIdSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(workspaceMemberSchema)),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
      ],
    },
  },
  {
    method: "POST",
    path: ROUTE_PATTERNS.workspaces.members,
    auth: "bearer",
    request: {
      params: workspaceIdSchema,
      body: addWorkspaceMemberSchema.omit({ workspaceId: true }),
    },
    responses: {
      success: { status: 201, schema: apiSuccessSchema(workspaceMemberSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
        standardRouteErrors.conflict,
      ],
    },
  },
  {
    method: "POST",
    path: ROUTE_PATTERNS.workspaces.invitations,
    auth: "bearer",
    request: {
      params: workspaceIdSchema,
      body: createWorkspaceInvitationSchema.omit({ workspaceId: true }),
    },
    responses: {
      success: {
        status: 201,
        schema: apiSuccessSchema(invitationResponseSchema),
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
    path: ROUTE_PATTERNS.workspaces.memberByUserId,
    auth: "bearer",
    request: {
      params: workspaceMemberParamsSchema,
      body: updateWorkspaceMemberRoleSchema.omit({
        workspaceId: true,
        memberUserId: true,
      }),
    },
    responses: {
      success: { status: 200, schema: apiSuccessSchema(workspaceMemberSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
      ],
    },
  },
  {
    method: "DELETE",
    path: ROUTE_PATTERNS.workspaces.memberByUserId,
    auth: "bearer",
    request: { params: workspaceMemberParamsSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(
          z.object({ removed: z.literal(true) }).strict(),
        ),
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
    path: ROUTE_PATTERNS.workspaces.join,
    auth: "bearer",
    request: { body: acceptWorkspaceInvitationSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(workspaceSummarySchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
        standardRouteErrors.conflict,
        {
          status: 410,
          schema: apiErrorSchema,
          description: "Invitation expired",
        },
      ],
    },
  },
  {
    method: "POST",
    path: ROUTE_PATTERNS.workspaces.leave,
    auth: "bearer",
    request: { params: workspaceIdSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.object({ left: z.literal(true) }).strict()),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
      ],
    },
  },
  {
    method: "POST",
    path: ROUTE_PATTERNS.workspaces.convertToTeam,
    auth: "bearer",
    request: {
      params: workspaceIdSchema,
      body: convertWorkspaceToTeamSchema.omit({ workspaceId: true }),
    },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(workspaceSummarySchema),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
        standardRouteErrors.notFound,
        {
          status: 400,
          schema: apiErrorSchema,
          description: "Workspace already team",
        },
      ],
    },
  },
  {
    method: "GET",
    path: ROUTE_PATTERNS.workspaces.updates,
    auth: "bearer",
    request: {
      params: workspaceIdSchema,
      query: workspaceUpdatesQuerySchema,
    },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(z.array(workspaceEventSchema)),
      },
      errors: [
        standardRouteErrors.validationFailed,
        standardRouteErrors.forbidden,
      ],
    },
  },
];
