import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { authRepo, setAuthRepoDbClient } from "../../src/modules/auth/repo.js";
import { authService } from "../../src/modules/auth/service.js";
import { workspacesService } from "../../src/modules/workspaces/service.js";
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
    expect(listed.every((item) => item._id === item.id)).toBe(true);
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
    expect(created._id).toBe(created.id);
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

  it("creates invitation and allows member to join", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const invitee = await authService.register({
      name: "Invitee",
      email: "invitee@example.com",
      password: "password123",
      accountType: "single",
    });

    const created = await workspacesService.createForUser(owner.user.id, {
      name: "Invite Team",
    });

    const invitation = await workspacesService.createInvitationForUser(
      owner.user.id,
      {
        workspaceId: created.id,
        email: invitee.user.email,
        role: "member",
      },
    );

    const joined = await workspacesService.joinForUser(invitee.user.id, {
      token: invitation.token,
    });

    expect(joined.id).toBe(created.id);
    expect(joined.role).toBe("member");

    const members = await workspacesService.listMembersForUser(
      owner.user.id,
      created.id,
    );
    expect(members).toHaveLength(2);
  });

  it("converts personal workspace to team", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });

    const converted = await workspacesService.convertToTeamForUser(
      owner.user.id,
      {
        workspaceId: owner.workspace.id,
        name: "Owner Team",
      },
    );

    expect(converted.type).toBe("team");
    expect(converted.name).toBe("Owner Team");
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

  it("resolves a raced double-join on the same invitation token as a clean conflict", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const invitee = await authService.register({
      name: "Invitee",
      email: "invitee@example.com",
      password: "password123",
      accountType: "single",
    });

    const created = await workspacesService.createForUser(owner.user.id, {
      name: "Race Join Team",
    });

    const invitation = await workspacesService.createInvitationForUser(
      owner.user.id,
      {
        workspaceId: created.id,
        email: invitee.user.email,
        role: "member",
      },
    );

    // Both requests read the invitation as "not yet accepted" before either write happens - the
    // second createMembership hits the DB's UNIQUE(user_id, workspace_id) constraint and must
    // resolve to the same friendly 409, not an unhandled 500.
    const [first, second] = await Promise.allSettled([
      workspacesService.joinForUser(invitee.user.id, {
        token: invitation.token,
      }),
      workspacesService.joinForUser(invitee.user.id, {
        token: invitation.token,
      }),
    ]);

    const outcomes = [first, second];
    const fulfilled = outcomes.filter((o) => o.status === "fulfilled");
    const rejected = outcomes.filter((o) => o.status === "rejected");

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0]).toMatchObject({
      reason: expect.objectContaining({
        statusCode: 409,
        message: "User is already a workspace member",
      }),
    });

    const members = await workspacesService.listMembersForUser(
      owner.user.id,
      created.id,
    );
    expect(members).toHaveLength(2);
  });

  it("rejects addMemberForUser cleanly when the target is already a member", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const target = await authService.register({
      name: "Target",
      email: "target@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Add Member Race Team",
    });

    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: target.user.email,
      role: "member",
    });

    await expect(
      workspacesService.addMemberForUser(owner.user.id, {
        workspaceId: workspace.id,
        email: target.user.email,
        role: "member",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "User is already a workspace member",
    });
  });

  it("reports hasMore accurately at the exact page-size boundary", async () => {
    const owner = await authService.register({
      name: "Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "single",
    });
    const memberOne = await authService.register({
      name: "Member One",
      email: "member-one@example.com",
      password: "password123",
      accountType: "single",
    });
    const memberTwo = await authService.register({
      name: "Member Two",
      email: "member-two@example.com",
      password: "password123",
      accountType: "single",
    });

    const workspace = await workspacesService.createForUser(owner.user.id, {
      name: "Pagination Team",
    });
    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: memberOne.user.email,
      role: "member",
    });
    await workspacesService.addMemberForUser(owner.user.id, {
      workspaceId: workspace.id,
      email: memberTwo.user.email,
      role: "member",
    });

    // Exactly 3 events exist ("workspace created" + 2x "member added"). Asking for a page of
    // exactly 3 must report hasMore: false - not "true" just because the page was full.
    const exactPage = await workspacesService.listUpdatesForUser(
      owner.user.id,
      workspace.id,
      { since: 0, limit: 3 },
    );
    expect(exactPage.items).toHaveLength(3);
    expect(exactPage.cursor.hasMore).toBe(false);

    // A smaller page size should still correctly report more events remain.
    const partialPage = await workspacesService.listUpdatesForUser(
      owner.user.id,
      workspace.id,
      { since: 0, limit: 2 },
    );
    expect(partialPage.items).toHaveLength(2);
    expect(partialPage.cursor.hasMore).toBe(true);
  });
});
