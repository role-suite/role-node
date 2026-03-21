import { describe, expect, it } from "vitest";

import {
  createWorkspaceExportSchema,
  createWorkspaceImportSchema,
  workspaceImportExportJobByIdParamsSchema,
} from "../../src/modules/import-export/import-export.schema.js";

describe("import-export schema", () => {
  it("parses export payload", () => {
    const parsed = createWorkspaceExportSchema.parse({
      format: "json",
      includeCollections: true,
      includeRuns: false,
    });

    expect(parsed.format).toBe("json");
  });

  it("parses import payload", () => {
    const parsed = createWorkspaceImportSchema.parse({
      format: "json",
      payload: {
        version: 1,
        collections: [],
      },
    });

    expect(parsed.payload).toMatchObject({ version: 1 });
  });

  it("coerces job params", () => {
    const parsed = workspaceImportExportJobByIdParamsSchema.parse({
      workspaceId: "5",
      jobId: "9",
    });

    expect(parsed.workspaceId).toBe(5);
    expect(parsed.jobId).toBe(9);
  });
});
