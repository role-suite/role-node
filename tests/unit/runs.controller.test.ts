import { describe, expect, it, vi } from "vitest";

const {
  createRunForWorkspaceMock,
  getRunByIdForWorkspaceMock,
  cancelRunForWorkspaceMock,
} = vi.hoisted(() => ({
  createRunForWorkspaceMock: vi.fn(),
  getRunByIdForWorkspaceMock: vi.fn(),
  cancelRunForWorkspaceMock: vi.fn(),
}));

vi.mock("../../src/modules/runs/runs.service.js", () => ({
  runsService: {
    createRunForWorkspace: createRunForWorkspaceMock,
    getRunByIdForWorkspace: getRunByIdForWorkspaceMock,
    cancelRunForWorkspace: cancelRunForWorkspaceMock,
  },
}));

import { runsController } from "../../src/modules/runs/runs.controller.js";

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

describe("runs controller", () => {
  it("creates, gets and cancels runs", async () => {
    const response = createResponse();
    createRunForWorkspaceMock.mockResolvedValue({ runId: 10 });
    getRunByIdForWorkspaceMock.mockResolvedValue({ runId: 10 });
    cancelRunForWorkspaceMock.mockResolvedValue({
      runId: 10,
      status: "cancelled",
    });

    await runsController.create(
      {
        auth: { userId: 4 },
        params: { workspaceId: "2" },
        body: {
          source: {
            type: "collectionEndpoint",
            collectionId: 5,
            endpointId: 6,
          },
        },
      } as never,
      response as never,
    );

    expect(createRunForWorkspaceMock).toHaveBeenCalledWith(
      4,
      2,
      expect.objectContaining({
        source: expect.objectContaining({ endpointId: 6 }),
      }),
    );

    await runsController.getById(
      {
        auth: { userId: 4 },
        params: { workspaceId: "2", runId: "10" },
      } as never,
      response as never,
    );
    expect(getRunByIdForWorkspaceMock).toHaveBeenCalledWith(4, 2, 10);

    await runsController.cancel(
      {
        auth: { userId: 4 },
        params: { workspaceId: "2", runId: "10" },
      } as never,
      response as never,
    );
    expect(cancelRunForWorkspaceMock).toHaveBeenCalledWith(4, 2, 10);
  });

  it("throws when auth context is missing", async () => {
    const response = createResponse();

    await expect(
      runsController.cancel(
        {
          params: { workspaceId: "2", runId: "10" },
        } as never,
        response as never,
      ),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Missing authenticated context",
    });
  });
});
