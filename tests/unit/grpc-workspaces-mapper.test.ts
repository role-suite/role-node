import { describe, expect, it } from "vitest";

import {
  toGrpcWorkspaceInvitation,
  toGrpcWorkspaceMember,
  toGrpcWorkspaceSummary,
  toGrpcWorkspaceUpdate,
} from "../../src/grpc/mappers/workspaces.js";

describe("grpc workspaces mapper", () => {
  it("maps workspace summary fields", () => {
    const mapped = toGrpcWorkspaceSummary({
      id: 1,
      _id: 1,
      name: "Team",
      slug: "team",
      type: "team",
      role: "owner",
    });

    expect(mapped.legacy_id).toBe(1);
    expect(mapped.role).toBe("owner");
  });

  it("maps workspace invitation and update", () => {
    const invitation = toGrpcWorkspaceInvitation({
      id: 10,
      workspaceId: 1,
      email: "a@b.com",
      role: "member",
      token: "token",
      expiresAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(invitation.workspace_id).toBe(1);

    const update = toGrpcWorkspaceUpdate({
      id: 5,
      workspaceId: 1,
      actorUserId: 2,
      entity: "workspace",
      action: "created",
      entityId: null,
      payload: { name: "Team" },
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(update.entity_id).toBe(0);
    expect(update.payload_json).toContain("Team");
  });

  it("maps workspace member", () => {
    const mapped = toGrpcWorkspaceMember({
      userId: 3,
      name: "Member",
      email: "m@e.com",
      role: "admin",
    });
    expect(mapped.user_id).toBe(3);
  });
});
