import { describe, expect, it } from "vitest";

import {
  createRunSchema,
  workspaceRunByIdParamsSchema,
} from "../../src/modules/runs/runs.schema.js";

describe("runs schema", () => {
  it("parses adhoc create payload", () => {
    const parsed = createRunSchema.parse({
      source: {
        type: "adhoc",
        request: {
          method: "GET",
          url: "https://api.example.com/orders",
          headers: [{ key: "accept", value: "application/json" }],
        },
      },
      options: {
        timeoutMs: 5000,
      },
    });

    expect(parsed.source.type).toBe("adhoc");
  });

  it("coerces run id params", () => {
    const parsed = workspaceRunByIdParamsSchema.parse({
      workspaceId: "2",
      runId: "19",
    });

    expect(parsed.workspaceId).toBe(2);
    expect(parsed.runId).toBe(19);
  });
});
