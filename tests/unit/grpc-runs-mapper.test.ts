import { describe, expect, it } from "vitest";

import {
  parseRunCreatePayload,
  toGrpcRunResponse,
} from "../../src/grpc/mappers/runs.js";

describe("grpc runs mapper", () => {
  it("parses run create payload JSON", () => {
    const parsed = parseRunCreatePayload<{ source: { type: string } }>(
      JSON.stringify({ source: { type: "adhoc" } }),
    );

    expect(parsed.source.type).toBe("adhoc");
  });

  it("serializes run response JSON", () => {
    const mapped = toGrpcRunResponse({ runId: 1, status: "completed" });
    expect(mapped.run_json).toContain('"runId":1');
  });
});
