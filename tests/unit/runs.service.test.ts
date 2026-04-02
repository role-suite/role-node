import { beforeEach, describe, expect, it, vi } from "vitest";

import { authRepo } from "../../src/modules/auth/auth.repo.js";
import type { CreateRunInput } from "../../src/modules/runs/runs.schema.js";
import { runsService } from "../../src/modules/runs/runs.service.js";

const { runRequestMock, getRunByIdMock, cancelRunMock } = vi.hoisted(() => ({
  runRequestMock: vi.fn(),
  getRunByIdMock: vi.fn(),
  cancelRunMock: vi.fn(),
}));

vi.mock("../../src/internal/runner/index.js", () => ({
  runRequest: runRequestMock,
  getRunById: getRunByIdMock,
  cancelRun: cancelRunMock,
}));

const buildCompletedRun = () => ({
  runId: 1,
  status: "completed" as const,
  startedAt: new Date("2024-01-01T00:00:00.000Z"),
  completedAt: new Date("2024-01-01T00:00:01.000Z"),
  durationMs: 1000,
  request: {
    method: "POST" as const,
    url: "https://api.example.com/orders",
    headers: [],
    queryParams: [],
    body: null,
    auth: { type: "none" as const },
    resolvedVariables: {},
    timeoutMs: 10000,
  },
  response: {
    status: 200,
    headers: {},
    body: "{}",
    bodyBase64: null,
    truncated: false,
    sizeBytes: 2,
  },
  error: null,
});

describe("runs service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(authRepo, "findMembershipByUserAndWorkspace").mockResolvedValue({
      id: 1,
      userId: 12,
      workspaceId: 34,
      role: "owner",
      createdAt: new Date(),
    });
  });

  it("maps adhoc payload into execute input with formdata body and options", async () => {
    runRequestMock.mockResolvedValue(buildCompletedRun());

    const payload: CreateRunInput = {
      source: {
        type: "adhoc",
        request: {
          method: "POST",
          url: "https://api.example.com/orders",
          headers: [{ key: "x-api-key", value: "token", enabled: false }],
          queryParams: [{ key: "page", value: "1" }],
          body: {
            mode: "formdata",
            entries: [
              { type: "text", key: "name", value: "order-1" },
              {
                type: "file",
                key: "attachment",
                fileName: "payload.json",
                dataBase64: "eyJvayI6dHJ1ZX0=",
                contentType: "application/json",
              },
            ],
          },
        },
      },
      environmentId: 50,
      variableOverrides: [{ key: "region", value: "eu-west-1" }],
      options: {
        timeoutMs: 5000,
        followRedirects: false,
        maxResponseBytes: 2048,
      },
    };

    await runsService.createRunForWorkspace(12, 34, payload);

    expect(runRequestMock).toHaveBeenCalledWith({
      workspaceId: 34,
      initiatedByUserId: 12,
      source: {
        type: "adhoc",
        request: {
          method: "POST",
          url: "https://api.example.com/orders",
          headers: [{ key: "x-api-key", value: "token", enabled: false }],
          queryParams: [{ key: "page", value: "1" }],
          body: {
            mode: "formdata",
            entries: [
              { type: "text", key: "name", value: "order-1" },
              {
                type: "file",
                key: "attachment",
                fileName: "payload.json",
                dataBase64: "eyJvayI6dHJ1ZX0=",
                contentType: "application/json",
              },
            ],
          },
          auth: { type: "none" },
        },
      },
      environmentId: 50,
      variableOverrides: [{ key: "region", value: "eu-west-1" }],
      options: {
        timeoutMs: 5000,
        followRedirects: false,
        maxResponseBytes: 2048,
      },
    });
  });

  it("maps collection endpoint payload and omits optional fields", async () => {
    runRequestMock.mockResolvedValue(buildCompletedRun());

    await runsService.createRunForWorkspace(12, 34, {
      source: {
        type: "collectionEndpoint",
        collectionId: 3,
        endpointId: 8,
      },
    });

    expect(runRequestMock).toHaveBeenCalledWith({
      workspaceId: 34,
      initiatedByUserId: 12,
      source: {
        type: "collectionEndpoint",
        collectionId: 3,
        endpointId: 8,
      },
    });
  });

  it.each([
    ["RUN_VALIDATION_FAILED", 400],
    ["RUN_ACCESS_DENIED", 403],
    ["RUN_SOURCE_NOT_FOUND", 404],
    ["RUN_POLICY_BLOCKED", 422],
    ["RUN_TIMEOUT", 408],
    ["RUN_NETWORK_ERROR", 502],
    ["RUN_RESPONSE_TOO_LARGE", 413],
    ["RUN_CANCELLED", 409],
    ["RUN_INTERNAL_ERROR", 500],
  ])("maps %s run error to %i", async (code, statusCode) => {
    runRequestMock.mockResolvedValue({
      ...buildCompletedRun(),
      status: "failed",
      error: {
        code,
        message: "Run failed",
        details: { test: true },
      },
    });

    await expect(
      runsService.createRunForWorkspace(12, 34, {
        source: {
          type: "collectionEndpoint",
          collectionId: 1,
          endpointId: 2,
        },
      }),
    ).rejects.toMatchObject({
      statusCode,
      message: "Run failed",
      success: false,
    });
  });

  it("throws not found for missing run lookups and cancels", async () => {
    getRunByIdMock.mockResolvedValue(null);
    cancelRunMock.mockResolvedValue(null);

    await expect(
      runsService.getRunByIdForWorkspace(12, 34, 5),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Run not found",
    });

    await expect(
      runsService.cancelRunForWorkspace(12, 34, 5),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Run not found",
    });
  });

  it("rejects users that are not workspace members", async () => {
    vi.spyOn(authRepo, "findMembershipByUserAndWorkspace").mockResolvedValue(
      null,
    );

    await expect(
      runsService.createRunForWorkspace(12, 34, {
        source: {
          type: "collectionEndpoint",
          collectionId: 1,
          endpointId: 2,
        },
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Workspace access denied",
    });
  });
});
