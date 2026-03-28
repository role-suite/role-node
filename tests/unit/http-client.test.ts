import { Buffer } from "node:buffer";

import { afterEach, describe, expect, it, vi } from "vitest";

import { executeHttpRequest } from "../../src/internal/runner/execution/http-client.js";
import type { HttpRequestDraft } from "../../src/internal/runner/core/types.js";

const defaultOptions = {
  timeoutMs: 2000,
  followRedirects: true,
  maxResponseBytes: 1024 * 1024,
  maxRedirects: 5,
} as const;

const createRequest = (body: HttpRequestDraft["body"]): HttpRequestDraft => {
  return {
    method: "POST",
    url: "https://api.example.com/upload",
    headers: [{ key: "x-trace-id", value: "trace-1" }],
    queryParams: [],
    body,
    auth: { type: "none" },
  };
};

describe("http client request body handling", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends formdata payload and strips explicit content-type header", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("ok", {
        status: 200,
      }),
    );

    await executeHttpRequest(
      {
        ...createRequest({
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
        }),
        headers: [
          { key: "content-type", value: "multipart/form-data" },
          { key: "x-trace-id", value: "trace-1" },
        ],
      },
      defaultOptions,
    );

    const [, init] = fetchSpy.mock.calls[0] ?? [];
    expect(init).toBeDefined();
    expect((init?.headers as Record<string, string>)["content-type"]).toBe(
      undefined,
    );

    const body = init?.body;
    expect(body).toBeInstanceOf(FormData);

    const formData = body as FormData;
    expect(formData.get("folder")).toBe("docs");

    const file = formData.get("file");
    expect(file).toBeInstanceOf(File);
    expect((file as File).name).toBe("hello.txt");
    expect((file as File).type).toBe("text/plain");
  });

  it("sends binary payload with default content-type", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("ok", {
        status: 200,
      }),
    );

    await executeHttpRequest(
      createRequest({
        mode: "binary",
        fileName: "payload.bin",
        dataBase64: "aGVsbG8=",
      }),
      defaultOptions,
    );

    const [, init] = fetchSpy.mock.calls[0] ?? [];
    const body = init?.body;
    expect(Buffer.isBuffer(body)).toBe(true);
    expect((body as Buffer).toString("utf8")).toBe("hello");
    expect((init?.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/octet-stream",
    );
  });

  it("omits request body for mode none", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("ok", {
        status: 200,
      }),
    );

    await executeHttpRequest(createRequest({ mode: "none" }), defaultOptions);

    const [, init] = fetchSpy.mock.calls[0] ?? [];
    expect(init).toBeDefined();
    expect(init?.body).toBe(undefined);
  });
});
