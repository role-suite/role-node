import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const DEFAULT_ACCESS_TOKEN_SECRET = "dev-access-secret-change-me";
const DEFAULT_REFRESH_TOKEN_SECRET = "dev-refresh-secret-change-me";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().max(65535).default(3000),
    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().int().positive(),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_POOL_MIN: z.coerce.number().int().min(0).default(0),
    DB_POOL_MAX: z.coerce.number().int().positive().default(10),
    DB_SSL: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    ENABLE_STARTUP_VALIDATION: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
    REQUEST_BODY_LIMIT: z.string().min(1).default("1mb"),
    AUTH_ACCESS_TOKEN_SECRET: z
      .string()
      .min(16)
      .default(DEFAULT_ACCESS_TOKEN_SECRET),
    AUTH_REFRESH_TOKEN_SECRET: z
      .string()
      .min(16)
      .default(DEFAULT_REFRESH_TOKEN_SECRET),
    AUTH_ACCESS_TOKEN_TTL_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .default(900),
    AUTH_REFRESH_TOKEN_TTL_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .default(60 * 60 * 24 * 7),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
    AUTH_RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
    SERVER_KEEP_ALIVE_TIMEOUT_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(5_000),
    SERVER_HEADERS_TIMEOUT_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    SERVER_REQUEST_TIMEOUT_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(300_000),
    TRUST_PROXY: z
      .string()
      .default("false")
      .transform((value): boolean | number | string => {
        const trimmed = value.trim();

        if (trimmed === "true") {
          return true;
        }

        if (trimmed === "false") {
          return false;
        }

        if (/^\d+$/.test(trimmed)) {
          return Number(trimmed);
        }

        return trimmed;
      }),
  })
  .superRefine((input, ctx) => {
    if (input.DB_POOL_MAX < input.DB_POOL_MIN) {
      ctx.addIssue({
        code: "custom",
        message: "DB_POOL_MAX must be greater than or equal to DB_POOL_MIN",
        path: ["DB_POOL_MAX"],
      });
    }

    if (input.SERVER_HEADERS_TIMEOUT_MS <= input.SERVER_KEEP_ALIVE_TIMEOUT_MS) {
      ctx.addIssue({
        code: "custom",
        message:
          "SERVER_HEADERS_TIMEOUT_MS must be greater than SERVER_KEEP_ALIVE_TIMEOUT_MS",
        path: ["SERVER_HEADERS_TIMEOUT_MS"],
      });
    }

    if (input.NODE_ENV !== "production") {
      return;
    }

    if (input.AUTH_ACCESS_TOKEN_SECRET === DEFAULT_ACCESS_TOKEN_SECRET) {
      ctx.addIssue({
        code: "custom",
        message: "AUTH_ACCESS_TOKEN_SECRET must be changed in production",
        path: ["AUTH_ACCESS_TOKEN_SECRET"],
      });
    }

    if (input.AUTH_REFRESH_TOKEN_SECRET === DEFAULT_REFRESH_TOKEN_SECRET) {
      ctx.addIssue({
        code: "custom",
        message: "AUTH_REFRESH_TOKEN_SECRET must be changed in production",
        path: ["AUTH_REFRESH_TOKEN_SECRET"],
      });
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables",
    parsedEnv.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsedEnv.data;
