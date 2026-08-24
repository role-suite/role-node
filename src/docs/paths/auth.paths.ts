import type { ZodOpenApiPathsObject } from "zod-openapi";

import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  switchWorkspaceSchema,
} from "../../modules/auth/schema.js";
import { ROUTE_PATTERNS } from "../../shared/routes.js";
import {
  authResponseSchema,
  meResponseSchema,
  refreshResponseSchema,
  revokeOtherSessionsResponseSchema,
  sessionSummarySchema,
} from "../schemas/auth.js";
import {
  BEARER_AUTH,
  actionConfirmationSchema,
  listEnvelope,
  successEnvelope,
  withErrors,
} from "../schemas/common.js";

export const authPaths: ZodOpenApiPathsObject = {
  [ROUTE_PATTERNS.auth.register]: {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      description:
        "Creates a user and either a personal workspace (`accountType: single`) or a new team workspace (`accountType: team`).",
      requestBody: {
        content: {
          "application/json": {
            schema: registerSchema,
            examples: {
              single: {
                summary: "Personal account",
                value: {
                  accountType: "single",
                  name: "Ada Lovelace",
                  email: "ada@example.com",
                  password: "correct-horse-battery",
                },
              },
              team: {
                summary: "Team account",
                value: {
                  accountType: "team",
                  name: "Ada Lovelace",
                  email: "ada@example.com",
                  password: "correct-horse-battery",
                  teamName: "Analytical Engines Inc",
                },
              },
            },
          },
        },
      },
      responses: withErrors(
        {
          "201": {
            description: "User registered",
            content: {
              "application/json": {
                schema: successEnvelope(authResponseSchema),
              },
            },
          },
        },
        ["400", "409"],
        { "409": "Email already in use" },
      ),
    },
  },
  [ROUTE_PATTERNS.auth.login]: {
    post: {
      tags: ["Auth"],
      summary: "Log in",
      requestBody: {
        content: {
          "application/json": {
            schema: loginSchema,
            example: {
              email: "ada@example.com",
              password: "correct-horse-battery",
            },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Login succeeded",
            content: {
              "application/json": {
                schema: successEnvelope(authResponseSchema),
              },
            },
          },
        },
        ["400", "401", "403", "404"],
        {
          "401": "Invalid credentials",
          "403": "No workspace membership found",
          "404": "Workspace not found",
        },
      ),
    },
  },
  [ROUTE_PATTERNS.auth.refresh]: {
    post: {
      tags: ["Auth"],
      summary: "Refresh access/refresh token pair",
      requestBody: {
        content: {
          "application/json": {
            schema: refreshTokenSchema,
            example: { refreshToken: "<refresh-token-from-login>" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "New token pair issued",
            content: {
              "application/json": {
                schema: successEnvelope(refreshResponseSchema),
              },
            },
          },
        },
        ["400", "401"],
        { "401": "Invalid or expired refresh token" },
      ),
    },
  },
  [ROUTE_PATTERNS.auth.logout]: {
    post: {
      tags: ["Auth"],
      summary: "Revoke a refresh token",
      requestBody: {
        content: {
          "application/json": {
            schema: refreshTokenSchema,
            example: { refreshToken: "<refresh-token-from-login>" },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Session revoked",
            content: {
              "application/json": { schema: actionConfirmationSchema },
            },
          },
        },
        ["400"],
      ),
    },
  },
  [ROUTE_PATTERNS.auth.switchWorkspace]: {
    post: {
      tags: ["Auth"],
      summary: "Switch the authenticated session to another workspace",
      description:
        "Reissues a token pair scoped to a different workspace the caller is a member of. Revokes the session tied to the access token used to call this endpoint.",
      security: [{ [BEARER_AUTH]: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: switchWorkspaceSchema,
            example: { workspaceId: 2 },
          },
        },
      },
      responses: withErrors(
        {
          "200": {
            description: "Token pair reissued for the target workspace",
            content: {
              "application/json": {
                schema: successEnvelope(authResponseSchema),
              },
            },
          },
        },
        ["400", "401", "403"],
        { "403": "Not a member of the target workspace" },
      ),
    },
  },
  [ROUTE_PATTERNS.auth.sessions]: {
    get: {
      tags: ["Auth"],
      summary: "List the caller's active sessions",
      description:
        "Returns one row per active (non-revoked, non-expired) session across all workspaces the caller has logged into, each flagged with whether it's the session backing the current access token.",
      security: [{ [BEARER_AUTH]: [] }],
      responses: withErrors(
        {
          "200": {
            description: "Active sessions",
            content: {
              "application/json": {
                schema: listEnvelope(sessionSummarySchema),
              },
            },
          },
        },
        ["401"],
      ),
    },
    delete: {
      tags: ["Auth"],
      summary: "Revoke all sessions except the current one",
      description:
        "Signs the caller out everywhere except the device making this request. Useful for a lost/stolen device.",
      security: [{ [BEARER_AUTH]: [] }],
      responses: withErrors(
        {
          "200": {
            description: "Other sessions revoked",
            content: {
              "application/json": {
                schema: successEnvelope(revokeOtherSessionsResponseSchema),
              },
            },
          },
        },
        ["401"],
      ),
    },
  },
  [ROUTE_PATTERNS.auth.sessionById]: {
    delete: {
      tags: ["Auth"],
      summary: "Revoke a specific session",
      description:
        "Revokes one of the caller's own sessions by id (e.g. to sign out a lost device). Not scoped to the session backing the current request.",
      security: [{ [BEARER_AUTH]: [] }],
      responses: withErrors(
        {
          "200": {
            description: "Session revoked",
            content: {
              "application/json": { schema: actionConfirmationSchema },
            },
          },
        },
        ["400", "401", "404"],
        { "404": "Session not found" },
      ),
    },
  },
  [ROUTE_PATTERNS.auth.me]: {
    get: {
      tags: ["Auth"],
      summary: "Get the current authenticated user",
      security: [{ [BEARER_AUTH]: [] }],
      responses: withErrors(
        {
          "200": {
            description: "Current user context",
            content: {
              "application/json": { schema: successEnvelope(meResponseSchema) },
            },
          },
        },
        ["401"],
      ),
    },
  },
};
