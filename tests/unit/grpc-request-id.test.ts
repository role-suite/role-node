import { Metadata } from "@grpc/grpc-js";
import { describe, expect, it } from "vitest";

import {
  GRPC_REQUEST_ID_HEADER,
  createRequestMetadata,
  resolveRequestId,
} from "../../src/grpc/interceptors/request-id.js";

describe("grpc request id interceptor", () => {
  it("reuses request id metadata when present", () => {
    const metadata = new Metadata();
    metadata.set(GRPC_REQUEST_ID_HEADER, "req-123");

    expect(resolveRequestId(metadata)).toBe("req-123");
  });

  it("creates a request id when missing", () => {
    const metadata = new Metadata();
    const requestId = resolveRequestId(metadata);

    expect(requestId.length).toBeGreaterThan(0);
  });

  it("creates response metadata with request id", () => {
    const metadata = createRequestMetadata("req-abc");

    expect(metadata.get(GRPC_REQUEST_ID_HEADER)[0]).toBe("req-abc");
  });
});
