import { z } from "zod";

const nameSchema = z.string().trim().min(2).max(120);
// Lowercased so lookups, the DB unique constraint, and login all treat email case-insensitively.
const emailSchema = z.email().toLowerCase();
// Capped well above any real password to bound argon2's hashing cost per request, not because
// the algorithm has bcrypt's 72-byte truncation limit.
const passwordSchema = z.string().min(8).max(128);

const singleAccountRegisterSchema = z.object({
  accountType: z.literal("single"),
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const teamAccountRegisterSchema = z.object({
  accountType: z.literal("team"),
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  teamName: z.string().trim().min(2).max(120),
});

export const registerSchema = z.discriminatedUnion("accountType", [
  singleAccountRegisterSchema,
  teamAccountRegisterSchema,
]);

export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
