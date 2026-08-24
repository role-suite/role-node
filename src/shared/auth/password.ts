import { createHash } from "node:crypto";

import argon2 from "argon2";

import { env } from "../../config/env.js";

// argon2's defaults (memoryCost 65536 KiB / 64MB, parallelism 4) are appropriately expensive for
// production, but that cost multiplies badly across ~40 test files hashing passwords in parallel
// worker threads - it was causing intermittent resource-contention flakes in the full suite run.
// Minimal-but-valid cost here only affects NODE_ENV=test; every other environment is unaffected.
const TEST_HASH_OPTIONS = {
  memoryCost: 1024,
  timeCost: 1,
  parallelism: 1,
} as const;

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    ...(env.NODE_ENV === "test" ? TEST_HASH_OPTIONS : {}),
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
