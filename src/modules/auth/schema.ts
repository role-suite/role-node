import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.email(),
    password: z.string().min(8).max(72),
    accountType: z.enum(["single", "team"]),
    teamName: z.string().trim().min(2).max(120).optional(),
  })
  .superRefine((payload, context) => {
    if (payload.accountType === "team" && !payload.teamName) {
      context.addIssue({
        code: "custom",
        path: ["teamName"],
        message: "teamName is required when accountType is 'team'",
      });
    }
  });

export const loginSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8).max(72),
  })
  .strict();

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
