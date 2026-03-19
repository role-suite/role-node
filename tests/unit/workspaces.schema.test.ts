import { describe, expect, it } from "vitest";

import {
  addWorkspaceMemberSchema,
  createWorkspaceSchema,
  updateWorkspaceMemberRoleSchema,
  workspaceIdSchema,
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

  it("rejects owner role for update member payload", () => {
    const result = updateWorkspaceMemberRoleSchema.safeParse({
      workspaceId: 1,
      memberUserId: 2,
      role: "owner",
    });

    expect(result.success).toBe(false);
  });
});
