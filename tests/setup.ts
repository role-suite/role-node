import { createHash } from "node:crypto";

import { vi } from "vitest";

// Real argon2 (memoryCost 65536 KiB, parallelism 4) is appropriately expensive for production,
// but that cost multiplies badly across ~40 test files hashing passwords in parallel worker
// threads, causing intermittent resource-contention flakes in the full suite run. Mocking the
// module here - rather than branching on NODE_ENV inside src/shared/auth/password.ts - keeps the
// real hashing function free of test-only logic, so there's no test-only weak-hash code path in
// application source for a security scanner to (rightly) flag.
vi.mock("argon2", () => {
  const digest = (value: string): string =>
    createHash("sha256").update(value).digest("hex");

  const impl = {
    argon2d: 0,
    argon2i: 1,
    argon2id: 2,
    hash: async (password: string): Promise<string> =>
      `test-hash$${digest(password)}`,
    verify: async (hash: string, password: string): Promise<boolean> =>
      hash === `test-hash$${digest(password)}`,
    needsRehash: (): boolean => false,
  };

  return { ...impl, default: impl };
});
