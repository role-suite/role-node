import { z } from "zod";
import type { ZodOpenApiResponsesObject } from "zod-openapi";

export const errorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.record(z.string(), z.unknown()),
      requestId: z.string(),
    }),
  })
  .meta({ id: "ErrorResponse" });

export const actionConfirmationSchema = z
  .object({
    success: z.literal(true),
    data: z.object({
      action: z.enum(["deleted", "left", "revoked", "cancelled"]),
    }),
  })
  .meta({ id: "ActionConfirmation" });

export const successEnvelope = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ success: z.literal(true), data });

export const listEnvelope = <T extends z.ZodTypeAny>(item: T) =>
  successEnvelope(z.object({ items: z.array(item) }));

export const cursorPageEnvelope = <T extends z.ZodTypeAny>(item: T) =>
  successEnvelope(
    z.object({
      items: z.array(item),
      cursor: z.object({
        next: z.number().int(),
        hasMore: z.boolean(),
      }),
    }),
  );

const errorResponse = (description: string) => ({
  description,
  content: {
    "application/json": { schema: errorResponseSchema },
  },
});

type ErrorCode = "400" | "401" | "403" | "404" | "409";

const DEFAULT_ERROR_DESCRIPTIONS: Record<ErrorCode, string> = {
  "400": "Validation failed",
  "401": "Missing or invalid authentication",
  "403": "Forbidden",
  "404": "Not found",
  "409": "Conflict",
};

export const withErrors = (
  responses: ZodOpenApiResponsesObject,
  codes: ErrorCode[],
  descriptions: Partial<Record<ErrorCode, string>> = {},
): ZodOpenApiResponsesObject => {
  const errorResponses = Object.fromEntries(
    codes.map((code) => [
      code,
      errorResponse(descriptions[code] ?? DEFAULT_ERROR_DESCRIPTIONS[code]),
    ]),
  );

  return { ...responses, ...errorResponses };
};

export const BEARER_AUTH = "bearerAuth" as const;
