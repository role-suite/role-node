import { describe, expect, it, vi } from "vitest";

import {
  REQUEST_ID_HEADER,
  requestIdMiddleware,
} from "../../src/shared/middleware/request-id.js";

const createResponse = () => {
  return {
    locals: {} as Record<string, unknown>,
    setHeader: vi.fn(),
  };
};

describe("request id middleware", () => {
  it("uses incoming x-request-id when provided", () => {
    const res = createResponse();
    const next = vi.fn();
    const req = {
      header: (name: string) =>
        name.toLowerCase() === REQUEST_ID_HEADER ? "incoming-id" : undefined,
    };

    requestIdMiddleware(req as never, res as never, next);

    expect(next).toHaveBeenCalledOnce();
    expect((req as { requestId?: string }).requestId).toBe("incoming-id");
    expect(res.locals.requestId).toBe("incoming-id");
    expect(res.setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, "incoming-id");
  });

  it("generates request id when missing", () => {
    const res = createResponse();
    const next = vi.fn();
    const req = {
      header: () => undefined,
    };

    requestIdMiddleware(req as never, res as never, next);

    expect(next).toHaveBeenCalledOnce();
    expect(typeof (req as { requestId?: string }).requestId).toBe("string");
    expect(String((req as { requestId?: string }).requestId)).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(res.locals.requestId).toBe((req as { requestId?: string }).requestId);
    expect(res.setHeader).toHaveBeenCalledWith(
      REQUEST_ID_HEADER,
      (req as { requestId?: string }).requestId,
    );
  });
});
