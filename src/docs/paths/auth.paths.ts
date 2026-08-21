import type { ZodOpenApiPathsObject } from "zod-openapi";

import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../../modules/auth/schema.js";
import { ROUTE_PATTERNS } from "../../shared/routes.js";
import {
  authResponseSchema,
  meResponseSchema,
  refreshResponseSchema,
} from "../schemas/auth.js";
import {
  BEARER_AUTH,
  actionConfirmationSchema,
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
