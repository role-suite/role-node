import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    GRPC_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    GRPC_PORT: z.coerce.number().int().positive().default(50051),
    GRPC_TLS_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    GRPC_MTLS_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    GRPC_TLS_CERT_PATH: z.string().min(1).optional(),
    GRPC_TLS_KEY_PATH: z.string().min(1).optional(),
    GRPC_TLS_CA_PATH: z.string().min(1).optional(),
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
    OTEL_ENABLED: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
    OTEL_SERVICE_NAME: z.string().min(1).default("role-node"),
    OTEL_SERVICE_VERSION: z.string().min(1).default("1.0.0"),
    OTEL_EXPORTER_OTLP_ENDPOINT: z
      .string()
      .url()
      .default("http://localhost:4318"),
    OTEL_METRICS_EXPORT_INTERVAL_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(30000),
    OTEL_TRACES_SAMPLER: z
      .enum(["always_on", "always_off", "ratio"])
      .default("always_on"),
    OTEL_TRACES_SAMPLER_RATIO: z.coerce.number().min(0).max(1).default(1),
    AUTH_ACCESS_TOKEN_SECRET: z
      .string()
      .min(16)
      .default("dev-access-secret-change-me"),
    AUTH_REFRESH_TOKEN_SECRET: z
      .string()
      .min(16)
      .default("dev-refresh-secret-change-me"),
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
  })
  .refine((input) => input.DB_POOL_MAX >= input.DB_POOL_MIN, {
    message: "DB_POOL_MAX must be greater than or equal to DB_POOL_MIN",
    path: ["DB_POOL_MAX"],
  })
  .refine(
    (input) => {
      if (!input.GRPC_TLS_ENABLED) {
        return true;
      }

      return Boolean(input.GRPC_TLS_CERT_PATH && input.GRPC_TLS_KEY_PATH);
    },
    {
      message:
        "GRPC_TLS_CERT_PATH and GRPC_TLS_KEY_PATH are required when GRPC_TLS_ENABLED=true",
      path: ["GRPC_TLS_CERT_PATH"],
    },
  )
  .refine(
    (input) => {
      if (!input.GRPC_MTLS_ENABLED) {
        return true;
      }

      return input.GRPC_TLS_ENABLED && Boolean(input.GRPC_TLS_CA_PATH);
    },
    {
      message:
        "GRPC_TLS_CA_PATH is required and GRPC_TLS_ENABLED must be true when GRPC_MTLS_ENABLED=true",
      path: ["GRPC_TLS_CA_PATH"],
    },
  )
  .refine(
    (input) => {
      if (!input.GRPC_MTLS_ENABLED) {
        return true;
      }

      return input.GRPC_TLS_ENABLED;
    },
    {
      message: "GRPC_TLS_ENABLED must be true when GRPC_MTLS_ENABLED=true",
      path: ["GRPC_TLS_ENABLED"],
    },
  );

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables",
    parsedEnv.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsedEnv.data;
