import { describe, expect, it, vi } from "vitest";

import { appResponse } from "../../src/shared/app-response.js";

const makeResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockReturnValue(response);

  return response;
};

describe("appResponse", () => {
  it("builds object envelopes", () => {
    expect(appResponse.object({ id: 1 })).toEqual({
      success: true,
      data: { id: 1 },
    });
  });

  it("builds list envelopes", () => {
    expect(appResponse.list([{ id: 1 }])).toEqual({
      success: true,
      data: { items: [{ id: 1 }] },
    });
  });

  it("builds cursor page envelopes", () => {
    expect(
      appResponse.cursorPage([{ id: 1 }], { next: 1, hasMore: false }),
    ).toEqual({
      success: true,
      data: {
        items: [{ id: 1 }],
        cursor: { next: 1, hasMore: false },
      },
    });
  });

  it("builds action envelopes", () => {
    expect(appResponse.action("deleted")).toEqual({
      success: true,
      data: { action: "deleted" },
    });
  });

  it("builds success envelopes", () => {
    expect(appResponse.success({ id: 1 })).toEqual({
      success: true,
      data: { id: 1 },
    });
  });

  it("sends success response via express response", () => {
    const response = makeResponse();

    appResponse.sendSuccess(response as never, 201, { id: 2 });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 2 },
    });
  });

  it("sends action response via express response", () => {
    const response = makeResponse();

    appResponse.sendAction(response as never, 200, "revoked");

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: { action: "revoked" },
    });
  });
});
