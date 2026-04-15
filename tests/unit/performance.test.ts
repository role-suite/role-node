import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { authService } from "../../src/modules/auth/auth.service.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/collections.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("performance tests", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
  });

  it("handles concurrent user registrations", async () => {
    const emails = Array.from({ length: 20 }, (_, i) => `user${i}@example.com`);

    const start = Date.now();
    const results = await Promise.all(
      emails.map((email) =>
        authService.register({
          name: "User",
          email,
          password: "password123",
          accountType: "single",
        }),
      ),
    );
    const duration = Date.now() - start;

    expect(results).toHaveLength(20);
    console.log(`Registered 20 users in ${duration}ms`);
  });

  it("handles rapid sequential operations", async () => {
    const user = await authService.register({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      accountType: "single",
    });

    const { workspacesService } =
      await import("../../src/modules/workspaces/workspaces.service.js");

    const start = Date.now();
    for (let i = 0; i < 20; i++) {
      await workspacesService.createForUser(user.user.id, { name: `WS ${i}` });
    }
    const duration = Date.now() - start;

    console.log(`Created 20 workspaces in ${duration}ms`);
  });

  it("handles concurrent reads", async () => {
    const user = await authRepo.createUser({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hash",
    });

    const reads = await Promise.all(
      Array.from({ length: 20 }, () => authRepo.findUserById(user.id)),
    );

    expect(reads.every((u) => u?.id === user.id)).toBe(true);
  });
});
