import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    DB_DIALECT: z.enum(["postgres", "mysql", "mariadb"]).default("postgres"),
    DATABASE_URL: z.string().min(1).optional(),
    DB_POOL_MIN: z.coerce.number().int().min(0).default(0),
    DB_POOL_MAX: z.coerce.number().int().positive().default(10),
    DB_SSL: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
  })
  .refine((input) => input.DB_POOL_MAX >= input.DB_POOL_MIN, {
    message: "DB_POOL_MAX must be greater than or equal to DB_POOL_MIN",
    path: ["DB_POOL_MAX"],
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
