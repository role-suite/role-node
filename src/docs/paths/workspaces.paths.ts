import type { ZodOpenApiPathsObject } from "zod-openapi";

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
} from "../../modules/workspaces/schema.js";
import { ROUTE_PATTERNS } from "../../shared/routes.js";
import {
  workspaceEventSchema,
  workspaceInvitationSchema,
  workspaceMemberSchema,
  workspaceSummarySchema,
} from "../schemas/workspaces.js";
import {
  BEARER_AUTH,
  actionConfirmationSchema,
  cursorPageEnvelope,
  listEnvelope,
  successEnvelope,
  withErrors,
} from "../schemas/common.js";

const auth = [{ [BEARER_AUTH]: [] }];

export const workspacesPaths: ZodOpenApiPathsObject = {
  [ROUTE_PATTERNS.workspaces.list]: {
    get: {
      tags: ["Workspaces"],
      summary: "List workspaces the current user belongs to",
      security: auth,
      responses: withErrors(
        {
          "200": {
            description: "Workspace list",
            content: {
              "application/json": {
                schema: listEnvelope(workspaceSummarySchema),
              },
            },
          },
        },
        ["401"],
      ),
    },
    post: {
      tags: ["Workspaces"],
      summary: "Create a new team workspace",
      security: auth,
      requestBody: {
        content: {
          "application/json": {
            schema: createWorkspaceSchema,
            example: { name: "Analytical Engines Inc" },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Workspace created",
            content: {
              "application/json": {
                schema: successEnvelope(workspaceSummarySchema),
              },
            },
          },
        },
        ["400", "401"],
      ),
    },
  },
  [ROUTE_PATTERNS.workspaces.byId]: {
    get: {
      tags: ["Workspaces"],
      summary: "Get a workspace by id",
      security: auth,
      requestParams: { path: workspaceIdSchema },
      responses: withErrors(
        {
          "200": {
            description: "Workspace",
            content: {
              "application/json": {
                schema: successEnvelope(workspaceSummarySchema),
              },
            },
          },
        },
        ["401", "403", "404"],
        { "403": "Workspace access denied" },
      ),
    },
  },
  [ROUTE_PATTERNS.workspaces.members]: {
    get: {
      tags: ["Workspaces"],
      summary: "List workspace members",
      security: auth,
      requestParams: { path: workspaceIdSchema },
      responses: withErrors(
        {
          "200": {
            description: "Member list",
            content: {
              "application/json": {
                schema: listEnvelope(workspaceMemberSchema),
              },
            },
          },
        },
        ["401", "403"],
      ),
    },
    post: {
      tags: ["Workspaces"],
      summary: "Add an existing user to a team workspace",
      security: auth,
      requestParams: { path: workspaceIdSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: addWorkspaceMemberSchema.omit({ workspaceId: true }),
            example: { email: "grace@example.com", role: "member" },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "Member added",
            content: {
              "application/json": {
                schema: successEnvelope(workspaceMemberSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404", "409"],
        { "409": "User is already a workspace member" },
      ),
    },
  },
  [ROUTE_PATTERNS.workspaces.invitations]: {
    post: {
      tags: ["Workspaces"],
      summary: "Create a join invitation for a team workspace",
      security: auth,
      requestParams: { path: workspaceIdSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: createWorkspaceInvitationSchema.omit({ workspaceId: true }),
            example: { email: "grace@example.com", role: "member" },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description:
              "Invitation created (includes token to deliver to invitee)",
            content: {
              "application/json": {
                schema: successEnvelope(workspaceInvitationSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404", "409"],
        {
          "409":
            "An unexpired invitation already exists for this email, or the user is already a member",
        },
      ),
    },
  },
  [ROUTE_PATTERNS.workspaces.join]: {
    post: {
      tags: ["Workspaces"],
      summary: "Accept an invitation token and join a workspace",
      security: auth,
      requestBody: {
        content: {
          "application/json": {
            schema: acceptWorkspaceInvitationSchema,
            example: { token: "<invitation-token>" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Joined workspace",
            content: {
              "application/json": {
                schema: successEnvelope(workspaceSummarySchema),
              },
            },
          },
        },
        ["400", "401", "404", "409"],
        { "409": "User is already a workspace member" },
      ),
    },
  },
  [ROUTE_PATTERNS.workspaces.memberByUserId]: {
    patch: {
      tags: ["Workspaces"],
      summary: "Update a member's role",
      security: auth,
      requestParams: { path: workspaceMemberParamsSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: updateWorkspaceMemberRoleSchema.omit({
              workspaceId: true,
              memberUserId: true,
            }),
            example: { role: "admin" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Member updated",
            content: {
              "application/json": {
                schema: successEnvelope(workspaceMemberSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404"],
      ),
    },
    delete: {
      tags: ["Workspaces"],
      summary: "Remove a member from the workspace",
      security: auth,
      requestParams: { path: workspaceMemberParamsSchema },
      responses: withErrors(
        {
          "200": {
            description: "Member removed",
            content: {
              "application/json": { schema: actionConfirmationSchema },
            },
          },
        },
        ["401", "403", "404"],
      ),
    },
  },
  [ROUTE_PATTERNS.workspaces.leave]: {
    post: {
      tags: ["Workspaces"],
      summary: "Leave a workspace",
      security: auth,
      requestParams: { path: workspaceIdSchema },
      responses: withErrors(
        {
          "200": {
            description: "Left workspace",
            content: {
              "application/json": { schema: actionConfirmationSchema },
            },
          },
        },
        ["401", "403", "409"],
        { "409": "Last workspace owner cannot leave" },
      ),
    },
  },
  [ROUTE_PATTERNS.workspaces.convertToTeam]: {
    post: {
      tags: ["Workspaces"],
      summary: "Convert a personal workspace into a team workspace",
      security: auth,
      requestParams: { path: workspaceIdSchema },
      requestBody: {
        content: {
          "application/json": {
            schema: convertWorkspaceToTeamSchema.omit({ workspaceId: true }),
            example: { name: "Analytical Engines Inc" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Workspace converted",
            content: {
              "application/json": {
                schema: successEnvelope(workspaceSummarySchema),
              },
            },
          },
        },
        ["400", "401", "403", "409"],
        { "409": "Workspace is already a team workspace" },
      ),
    },
  },
  [ROUTE_PATTERNS.workspaces.updates]: {
    get: {
      tags: ["Workspaces"],
      summary: "List workspace events by cursor",
      security: auth,
      requestParams: {
        path: workspaceIdSchema,
        query: workspaceUpdatesQuerySchema,
      },
      responses: withErrors(
        {
          "200": {
            description: "Workspace events",
            content: {
              "application/json": {
                schema: cursorPageEnvelope(workspaceEventSchema),
              },
            },
          },
        },
        ["401", "403"],
      ),
    },
  },
};
