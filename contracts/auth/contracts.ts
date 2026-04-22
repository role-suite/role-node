import { z } from "zod";

import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../../src/modules/auth/auth.schema.js";
import {
  apiErrorSchema,
  apiSuccessSchema,
  authTokenPairSchema,
  idSchema,
  standardRouteErrors,
  type EndpointContract,
  workspaceRoleSchema,
  workspaceTypeSchema,
} from "../shared.js";

const authUserSchema = z
  .object({
    id: idSchema,
    name: z.string(),
    email: z.string().email(),
  })
  .strict();

const authWorkspaceSchema = z
  .object({
    id: idSchema,
    _id: idSchema,
    name: z.string(),
    slug: z.string(),
    type: workspaceTypeSchema,
    role: workspaceRoleSchema,
  })
  .strict();

const membershipSchema = z
  .object({
    workspaceId: idSchema,
    _id: idSchema,
    name: z.string(),
    slug: z.string(),
    type: workspaceTypeSchema,
    role: workspaceRoleSchema,
  })
  .strict();

const authResponseSchema = z
  .object({
    user: authUserSchema,
    workspace: authWorkspaceSchema,
    memberships: z.array(membershipSchema),
    tokens: authTokenPairSchema,
  })
  .strict();

const meResponseSchema = authResponseSchema.omit({ tokens: true });

export const authContracts: EndpointContract[] = [
  {
    method: "POST",
    path: "/api/auth/register",
    auth: "none",
    request: { body: registerSchema },
    responses: {
      success: { status: 201, schema: apiSuccessSchema(authResponseSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        {
          status: 409,
          schema: apiErrorSchema,
          description: "Email already in use",
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/api/auth/login",
    auth: "none",
    request: { body: loginSchema },
    responses: {
      success: { status: 200, schema: apiSuccessSchema(authResponseSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        {
          status: 401,
          schema: apiErrorSchema,
          description: "Invalid credentials",
        },
        {
          status: 403,
          schema: apiErrorSchema,
          description: "No workspace membership found",
        },
        {
          status: 404,
          schema: apiErrorSchema,
          description: "Workspace not found",
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/api/auth/refresh",
    auth: "none",
    request: { body: refreshTokenSchema },
    responses: {
      success: { status: 200, schema: apiSuccessSchema(authResponseSchema) },
      errors: [
        standardRouteErrors.validationFailed,
        {
          status: 401,
          schema: apiErrorSchema,
          description: "Invalid refresh token or session",
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/api/auth/logout",
    auth: "none",
    request: { body: refreshTokenSchema },
    responses: {
      success: {
        status: 200,
        schema: apiSuccessSchema(
          z.object({ loggedOut: z.literal(true) }).strict(),
        ),
      },
      errors: [standardRouteErrors.validationFailed],
    },
  },
  {
    method: "GET",
    path: "/api/auth/me",
    auth: "bearer",
    request: {},
    responses: {
      success: { status: 200, schema: apiSuccessSchema(meResponseSchema) },
      errors: [
        standardRouteErrors.missingAccessToken,
        standardRouteErrors.invalidAccessToken,
      ],
    },
  },
];
