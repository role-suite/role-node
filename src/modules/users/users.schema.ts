import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.email()
});

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
