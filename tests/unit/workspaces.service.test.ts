import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { authService } from "../../src/modules/auth/auth.service.js";
import { workspacesService } from "../../src/modules/workspaces/workspaces.service.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

describe("workspaces service", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
  });

  it("lists workspaces for authenticated user", async () => {
    const account = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    await workspacesService.createForUser(account.user.id, {
      name: "API Team",
    });

    const listed = await workspacesService.listForUser(account.user.id);
    expect(listed).toHaveLength(2);
  });

  it("creates team workspace with owner role", async () => {
    const account = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const created = await workspacesService.createForUser(account.user.id, {
      name: "Core Team",
    });

    expect(created.type).toBe("team");
    expect(created.role).toBe("owner");
    expect(created.slug).toBe("core-team");
  });

  it("rejects access when user is not a member", async () => {
    const first = await authService.register({
      name: "First",
      email: "first@example.com",
      password: "password123",
      accountType: "single",
    });
    const second = await authService.register({
      name: "Second",
      email: "second@example.com",
      password: "password123",
      accountType: "single",
    });

    await expect(
      workspacesService.getByIdForUser(first.user.id, second.workspace.id),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Workspace access denied",
    });
  });

  it("allows owner to add and list members", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const member = await authService.register({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });

    const created = await workspacesService.createForUser(owner.user.id, {
      name: "Collab Team",
    });

    const added = await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: created.id,
      email: member.user.email,
      role: "member",
    });

    expect(added.role).toBe("member");

    const members = await workspacesService.listMembersForUser(
      owner.user.id,
      created.id,
    );
    expect(members).toHaveLength(2);
  });

  it("updates role and removes member", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const member = await authService.register({
      name: "Member",
      email: "member@example.com",
      password: "password123",
      accountType: "single",
    });

    const created = await workspacesService.createForUser(owner.user.id, {
      name: "Team Ops",
    });

    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: created.id,
      email: member.user.email,
      role: "member",
    });

    const updated = await workspacesService.updateMemberRoleForUser(
      owner.user.id,
      {
        workspaceId: created.id,
        memberUserId: member.user.id,
        role: "admin",
      },
    );
    expect(updated.role).toBe("admin");

    await workspacesService.removeMemberForUser(
      owner.user.id,
      created.id,
      member.user.id,
    );

    const members = await workspacesService.listMembersForUser(
      owner.user.id,
      created.id,
    );
    expect(members).toHaveLength(1);
  });

  it("prevents last owner from leaving workspace", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    await expect(
      workspacesService.leaveForUser(owner.user.id, owner.workspace.id),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Cannot leave as the last workspace owner",
    });
  });
});
