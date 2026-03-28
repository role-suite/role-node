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
          body: {
            mode: "formdata",
            entries: [
              {
                type: "text",
                key: "name",
                value: "demo",
              },
            ],
          },
        },
      },
      options: {
        timeoutMs: 5000,
      },
    });

    expect(parsed.source.type).toBe("adhoc");
  });

  it("supports legacy raw body payload", () => {
    const parsed = createRunSchema.parse({
      source: {
        type: "adhoc",
        request: {
          method: "POST",
          url: "https://api.example.com/orders",
          body: {
            raw: "{}",
          },
        },
      },
    });

    if (parsed.source.type !== "adhoc") {
      throw new Error("Unexpected source type");
    }

    expect(parsed.source.request.body?.mode).toBe("raw");
  });

  it("parses binary and none run body modes", () => {
    const binary = createRunSchema.parse({
      source: {
        type: "adhoc",
        request: {
          method: "POST",
          url: "https://api.example.com/upload",
          body: {
            mode: "binary",
            fileName: "payload.bin",
            contentType: "application/octet-stream",
            dataBase64: "aGVsbG8=",
          },
        },
      },
    });

    if (binary.source.type !== "adhoc") {
      throw new Error("Unexpected source type");
    }

    expect(binary.source.request.body?.mode).toBe("binary");

    const none = createRunSchema.parse({
      source: {
        type: "adhoc",
        request: {
          method: "POST",
          url: "https://api.example.com/upload",
          body: {
            mode: "none",
          },
        },
      },
    });

    if (none.source.type !== "adhoc") {
      throw new Error("Unexpected source type");
    }

    expect(none.source.request.body?.mode).toBe("none");
  });

  it("parses formdata body with file parts", () => {
    const parsed = createRunSchema.parse({
      source: {
        type: "adhoc",
        request: {
          method: "POST",
          url: "https://api.example.com/upload",
          body: {
            mode: "formdata",
            entries: [
              {
                type: "text",
                key: "folder",
                value: "docs",
              },
              {
                type: "file",
                key: "file",
                fileName: "hello.txt",
                contentType: "text/plain",
                dataBase64: "aGVsbG8=",
              },
            ],
          },
        },
      },
    });

    if (parsed.source.type !== "adhoc") {
      throw new Error("Unexpected source type");
    }

    expect(parsed.source.request.body?.mode).toBe("formdata");
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
