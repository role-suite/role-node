import { describe, expect, it } from "vitest";

import {
  createEnvironmentSchema,
  createEnvironmentVariableSchema,
  updateEnvironmentSchema,
  updateEnvironmentVariableSchema,
  workspaceEnvironmentByIdParamsSchema,
  workspaceEnvironmentParamsSchema,
  workspaceEnvironmentVariableByIdParamsSchema,
} from "../../src/modules/environments/environments.schema.js";

describe("environments schema", () => {
  it("parses create payload", () => {
    const parsed = createEnvironmentSchema.parse({
      name: "Staging",
    });

    expect(parsed.name).toBe("Staging");
  });

  it("coerces route params", () => {
    const parsed = workspaceEnvironmentByIdParamsSchema.parse({
      workspaceId: "2",
      environmentId: "5",
    });

    expect(parsed.workspaceId).toBe(2);
    expect(parsed.environmentId).toBe(5);
  });

  it("coerces variable route params", () => {
    const parsed = workspaceEnvironmentVariableByIdParamsSchema.parse({
      workspaceId: "2",
      environmentId: "5",
      variableId: "8",
    });

    expect(parsed.variableId).toBe(8);
  });

  it("rejects empty environment update payload", () => {
    const result = updateEnvironmentSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("parses variable payload", () => {
    const parsed = createEnvironmentVariableSchema.parse({
      key: "apiUrl",
      value: "https://api.example.com",
      enabled: true,
      isSecret: false,
      position: 1,
    });

    expect(parsed.key).toBe("apiUrl");
  });

  it("rejects empty variable update payload", () => {
    const result = updateEnvironmentVariableSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("coerces workspace-only params", () => {
    const parsed = workspaceEnvironmentParamsSchema.parse({ workspaceId: "4" });
    expect(parsed.workspaceId).toBe(4);
  });
});
