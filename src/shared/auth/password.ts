import { createHash } from "node:crypto";

import argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
};

export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};
