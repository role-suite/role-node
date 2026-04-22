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
    path: "/api/workspaces",
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
    path: "/api/workspaces/:workspaceId",
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
    path: "/api/workspaces",
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
    path: "/api/workspaces/:workspaceId/members",
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
    path: "/api/workspaces/:workspaceId/members",
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
    path: "/api/workspaces/:workspaceId/invitations",
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
    path: "/api/workspaces/:workspaceId/members/:memberUserId",
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
    path: "/api/workspaces/:workspaceId/members/:memberUserId",
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
    path: "/api/workspaces/join",
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
    path: "/api/workspaces/:workspaceId/leave",
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
    path: "/api/workspaces/:workspaceId/convert-to-team",
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
    path: "/api/workspaces/:workspaceId/updates",
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
