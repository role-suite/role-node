import { z } from "zod";

const membershipRoleSchema = z.enum(["owner", "admin", "member"]);

const authUserSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    email: z.email(),
  })
  .meta({ id: "AuthUser" });

const authWorkspaceSummarySchema = z
  .object({
    id: z.number().int(),
    _id: z.number().int(),
    name: z.string(),
    slug: z.string(),
    type: z.enum(["personal", "team"]),
    role: membershipRoleSchema,
  })
  .meta({ id: "AuthWorkspaceSummary" });

const authMembershipSummarySchema = z
  .object({
    workspaceId: z.number().int(),
    _id: z.number().int(),
    name: z.string(),
    slug: z.string(),
    type: z.enum(["personal", "team"]),
    role: membershipRoleSchema,
  })
  .meta({ id: "AuthMembershipSummary" });

const authTokensSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenTtlSeconds: z.number().int(),
    refreshTokenTtlSeconds: z.number().int(),
  })
  .meta({ id: "AuthTokens" });

export const authResponseSchema = z
  .object({
    user: authUserSchema,
    workspace: authWorkspaceSummarySchema,
    memberships: z.array(authMembershipSummarySchema),
    tokens: authTokensSchema,
  })
  .meta({ id: "AuthResponse" });

export const meResponseSchema = z
  .object({
    user: authUserSchema,
    workspace: authWorkspaceSummarySchema,
    memberships: z.array(authMembershipSummarySchema),
  })
  .meta({ id: "MeResponse" });

export const refreshResponseSchema = authTokensSchema;
