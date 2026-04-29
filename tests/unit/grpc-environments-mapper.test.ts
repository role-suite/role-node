import { describe, expect, it } from "vitest";

import {
  toGrpcEnvironmentItem,
  toGrpcEnvironmentVariableItem,
} from "../../src/grpc/mappers/environments.js";

describe("grpc environments mapper", () => {
  it("maps environment item", () => {
    const mapped = toGrpcEnvironmentItem({
      id: 1,
      workspaceId: 2,
      name: "dev",
      createdByUserId: 3,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(mapped.workspace_id).toBe(2);
    expect(mapped.name).toBe("dev");
  });

  it("maps environment variable item", () => {
    const mapped = toGrpcEnvironmentVariableItem({
      id: 4,
      environmentId: 1,
      key: "API_URL",
      value: "https://x",
      enabled: true,
      isSecret: false,
      position: 0,
      createdByUserId: 3,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(mapped.environment_id).toBe(1);
    expect(mapped.is_secret).toBe(false);
  });
});
