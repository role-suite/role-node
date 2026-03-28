import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { authService } from "../../src/modules/auth/auth.service.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("auth service", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
  });

  it("registers single-account user with personal workspace", async () => {
    const result = await authService.register({
      name: "Altay",
      email: "altay@example.com",
      password: "password123",
      accountType: "single",
    });

    expect(result.user.email).toBe("altay@example.com");
    expect(result.workspace.type).toBe("personal");
    expect(result.workspace.role).toBe("owner");
    expect(result.workspace._id).toBe(result.workspace.id);
    expect(result.memberships[0]?._id).toBe(result.workspace.id);
    expect(result.tokens.accessToken).toBeTypeOf("string");
  });

  it("logs in without workspaceId when user belongs to multiple workspaces", async () => {
    const account = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "team",
      teamName: "Core Team",
    });

    const anotherWorkspace = await authRepo.createWorkspace({
      name: "Side Team",
      type: "team",
      createdByUserId: account.user.id,
    });
    await authRepo.createMembership({
      userId: account.user.id,
      workspaceId: anotherWorkspace.id,
      role: "member",
    });

    const result = await authService.login({
      email: "owner@example.com",
      password: "password123",
    });

    expect(result.tokens.accessToken).toBeTypeOf("string");
    expect(result.memberships).toHaveLength(2);
    expect(result.workspace._id).toBe(result.workspace.id);
    expect(
      result.memberships.every((item) => item._id === item.workspaceId),
    ).toBe(true);
  });

  it("rotates refresh token", async () => {
    const registered = await authService.register({
      name: "Rotate",
      email: "rotate@example.com",
      password: "password123",
      accountType: "single",
    });

    const refreshed = await authService.refresh({
      refreshToken: registered.tokens.refreshToken,
    });

    expect(refreshed.tokens.refreshToken).not.toBe(
      registered.tokens.refreshToken,
    );
  });
});
