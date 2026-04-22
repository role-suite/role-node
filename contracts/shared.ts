import { z } from "zod";

export type AuthRequirement = "none" | "bearer";

export type EndpointContract = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  auth: AuthRequirement;
  request: {
    params?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    body?: z.ZodTypeAny;
  };
  responses: {
    success: {
      status: number;
      schema: z.ZodTypeAny;
    };
    errors: Array<{
      status: number;
      schema: z.ZodTypeAny;
      description: string;
    }>;
  };
};

export const idSchema = z.number().int().positive();
export const isoDateTimeStringSchema = z.string().min(1);

export const workspaceRoleSchema = z.enum(["owner", "admin", "member"]);
export const workspaceTypeSchema = z.enum(["personal", "team"]);

export const apiSuccessSchema = <T extends z.ZodTypeAny>(data: T) =>
  z
    .object({
      success: z.literal(true),
      data,
    })
    .strict();

export const apiObjectSuccessSchema = <T extends z.ZodTypeAny>(result: T) =>
  apiSuccessSchema(result);

export const apiListSuccessSchema = <T extends z.ZodTypeAny>(item: T) =>
  apiSuccessSchema(
    z
      .object({
        items: z.array(item),
      })
      .strict(),
  );

export const apiCursorShapeSchema = z
  .object({
    next: z.number().int().min(0),
    hasMore: z.boolean(),
  })
  .strict();

export const apiCursorPageSuccessSchema = <T extends z.ZodTypeAny>(item: T) =>
  apiSuccessSchema(
    z
      .object({
        items: z.array(item),
        cursor: apiCursorShapeSchema,
      })
      .strict(),
  );

export const actionConfirmationSchema = z.enum([
  "deleted",
  "left",
  "revoked",
  "cancelled",
]);

export const apiActionSuccessSchema = (
  action: z.infer<typeof actionConfirmationSchema>,
) =>
  apiSuccessSchema(
    z
      .object({
        action: z.literal(action),
      })
      .strict(),
  );

export const apiErrorSchema = z
  .object({
    success: z.literal(false),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.string(), z.unknown()),
        requestId: z.string(),
      })
      .strict(),
  })
  .strict();

export const validationErrorSchema = z
  .object({
    success: z.literal(false),
    error: z
      .object({
        code: z.literal("VALIDATION_FAILED"),
        message: z.literal("Validation failed"),
        details: z.object({
          fieldErrors: z.record(z.string(), z.array(z.string())),
        }),
        requestId: z.string(),
      })
      .strict(),
  })
  .strict();

export const authTokenPairSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenTtlSeconds: z.number().int().positive(),
    refreshTokenTtlSeconds: z.number().int().positive(),
  })
  .strict();

export const workspaceSummarySchema = z
  .object({
    id: idSchema,
    _id: idSchema,
    name: z.string(),
    slug: z.string(),
    type: workspaceTypeSchema,
    role: workspaceRoleSchema,
  })
  .strict();

export const workspaceMemberSchema = z
  .object({
    userId: idSchema,
    name: z.string(),
    email: z.string().email(),
    role: workspaceRoleSchema,
  })
  .strict();

export const standardRouteErrors = {
  missingAccessToken: {
    status: 401,
    schema: apiErrorSchema,
    description: "Missing access token",
  },
  invalidAccessToken: {
    status: 401,
    schema: apiErrorSchema,
    description: "Invalid access token or auth context",
  },
  validationFailed: {
    status: 400,
    schema: validationErrorSchema,
    description: "Request validation failed",
  },
  forbidden: {
    status: 403,
    schema: apiErrorSchema,
    description: "Authenticated user is not allowed",
  },
  notFound: {
    status: 404,
    schema: apiErrorSchema,
    description: "Requested resource does not exist",
  },
  conflict: {
    status: 409,
    schema: apiErrorSchema,
    description: "Resource conflict",
  },
};
