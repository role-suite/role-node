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

  it("builds error envelopes without optional data", () => {
    expect(appResponse.error("Not found")).toEqual({
      success: false,
      message: "Not found",
    });
  });

  it("builds error envelopes with optional data", () => {
    expect(
      appResponse.error("Validation failed", { email: ["Invalid"] }),
    ).toEqual({
      success: false,
      message: "Validation failed",
      data: { email: ["Invalid"] },
    });
  });

  it("builds error envelopes with status metadata", () => {
    expect(
      appResponse.withStatus(409, "Email already in use", {
        field: "email",
      }),
    ).toEqual({
      success: false,
      statusCode: 409,
      message: "Email already in use",
      data: { field: "email" },
    });
  });

  it("detects errors with status", () => {
    expect(
      appResponse.isErrorWithStatus(appResponse.withStatus(404, "Missing")),
    ).toBe(true);
    expect(appResponse.isErrorWithStatus(new Error("boom"))).toBe(false);
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

  it("sends error response via express response", () => {
    const response = makeResponse();

    appResponse.sendError(response as never, 400, "Validation failed", {
      name: ["Too short"],
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      data: { name: ["Too short"] },
    });
  });
});
