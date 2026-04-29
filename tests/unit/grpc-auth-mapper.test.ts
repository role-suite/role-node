import { describe, expect, it } from "vitest";

import { toGrpcAuthPayload } from "../../src/grpc/mappers/auth.js";

describe("grpc auth mapper", () => {
  it("maps auth payload including tokens", () => {
    const mapped = toGrpcAuthPayload({
      user: { id: 1, name: "User", email: "u@example.com" },
      workspace: {
        id: 2,
        _id: 2,
        name: "Workspace",
        slug: "workspace",
        type: "team",
        role: "owner",
      },
      memberships: [
        {
          workspaceId: 2,
          _id: 2,
          name: "Workspace",
          slug: "workspace",
          type: "team",
          role: "owner",
        },
      ],
      tokens: {
        accessToken: "a",
        refreshToken: "r",
        accessTokenTtlSeconds: 1,
        refreshTokenTtlSeconds: 2,
      },
    });

    expect(mapped.workspace.legacy_id).toBe(2);
    expect(mapped.memberships[0]?.workspace_id).toBe(2);
    expect(mapped.tokens?.access_token).toBe("a");
  });
});
