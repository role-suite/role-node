import { describe, expect, it } from "vitest";

import {
  parseImportExportPayload,
  toGrpcImportExportJob,
  toGrpcImportExportJobs,
} from "../../src/grpc/mappers/import-export.js";

describe("grpc import-export mapper", () => {
  it("parses import/export payload JSON", () => {
    const parsed = parseImportExportPayload<{ format: string }>(
      JSON.stringify({ format: "json" }),
    );

    expect(parsed.format).toBe("json");
  });

  it("serializes single job and list of jobs", () => {
    const one = toGrpcImportExportJob({ id: 1, type: "export" });
    const many = toGrpcImportExportJobs([{ id: 1 }, { id: 2 }]);

    expect(one.job_json).toContain('"type":"export"');
    expect(many.jobs_json).toHaveLength(2);
  });
});
