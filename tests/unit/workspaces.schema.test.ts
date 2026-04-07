import { describe, expect, it } from "vitest";

import {
  addWorkspaceMemberSchema,
  acceptWorkspaceInvitationSchema,
  convertWorkspaceToTeamSchema,
  createWorkspaceSchema,
  createWorkspaceInvitationSchema,
  updateWorkspaceMemberRoleSchema,
  workspaceIdSchema,
  workspaceUpdatesQuerySchema,
} from "../../src/modules/workspaces/workspaces.schema.js";

describe("workspaces schema", () => {
  it("parses valid create payload", () => {
    const parsed = createWorkspaceSchema.parse({ name: "Platform Team" });
    expect(parsed.name).toBe("Platform Team");
  });

  it("rejects too short workspace name", () => {
    const result = createWorkspaceSchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
  });

  it("coerces workspace id param", () => {
    const parsed = workspaceIdSchema.parse({ workspaceId: "12" });
    expect(parsed.workspaceId).toBe(12);
  });

  it("parses add member payload", () => {
    const parsed = addWorkspaceMemberSchema.parse({
      workspaceId: 1,
      email: "member@example.com",
      role: "member",
    });

    expect(parsed.email).toBe("member@example.com");
  });

  it("parses invitation create payload", () => {
    const parsed = createWorkspaceInvitationSchema.parse({
      workspaceId: 1,
      email: "invitee@example.com",
      role: "admin",
    });

    expect(parsed.role).toBe("admin");
  });

  it("parses invitation accept payload", () => {
    const parsed = acceptWorkspaceInvitationSchema.parse({
      token: "a".repeat(32),
    });

    expect(parsed.token).toHaveLength(32);
  });

  it("parses convert to team payload", () => {
    const parsed = convertWorkspaceToTeamSchema.parse({
      workspaceId: 9,
      name: "Team Alpha",
    });

    expect(parsed.workspaceId).toBe(9);
    expect(parsed.name).toBe("Team Alpha");
  });

  it("rejects owner role for update member payload", () => {
    const result = updateWorkspaceMemberRoleSchema.safeParse({
      workspaceId: 1,
      memberUserId: 2,
      role: "owner",
    });

    expect(result.success).toBe(false);
  });

  it("parses updates query defaults and limit", () => {
    const defaults = workspaceUpdatesQuerySchema.parse({});
    expect(defaults.since).toBe(0);
    expect(defaults.limit).toBe(50);

    const parsed = workspaceUpdatesQuerySchema.parse({
      since: "10",
      limit: "5",
    });
    expect(parsed.since).toBe(10);
    expect(parsed.limit).toBe(5);
  });
});
