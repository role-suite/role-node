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
});
