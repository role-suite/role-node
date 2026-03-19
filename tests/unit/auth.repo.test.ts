import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("auth repo", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
  });

  it("creates users with incrementing ids", async () => {
    const first = await authRepo.createUser({
      name: "First",
      email: "first@example.com",
      passwordHash: "hash1",
    });
    const second = await authRepo.createUser({
      name: "Second",
      email: "second@example.com",
      passwordHash: "hash2",
    });

    expect(first.id).toBe(1);
    expect(second.id).toBe(2);
  });

  it("creates workspace memberships and sessions", async () => {
    const user = await authRepo.createUser({
      name: "Owner",
      email: "owner@example.com",
      passwordHash: "hash",
    });
    const workspace = await authRepo.createWorkspace({
      name: "Product Team",
      type: "team",
      createdByUserId: user.id,
    });

    const membership = await authRepo.createMembership({
      userId: user.id,
      workspaceId: workspace.id,
      role: "owner",
    });
    const session = await authRepo.createSession({
      userId: user.id,
      workspaceId: workspace.id,
      refreshTokenHash: "token-hash",
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      authRepo.findMembershipByUserAndWorkspace(user.id, workspace.id),
    ).resolves.toEqual(membership);
    await expect(authRepo.findSessionById(session.id)).resolves.toEqual(
      session,
    );
  });
});
