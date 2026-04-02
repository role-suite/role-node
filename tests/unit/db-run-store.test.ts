import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  completeSuccessMock,
  completeFailureMock,
  createRunningMock,
  findByIdMock,
  cancelMock,
} = vi.hoisted(() => ({
  completeSuccessMock: vi.fn(),
  completeFailureMock: vi.fn(),
  createRunningMock: vi.fn(),
  findByIdMock: vi.fn(),
  cancelMock: vi.fn(),
}));

vi.mock("../../src/modules/runs/runs.repo.js", () => ({
  runsRepo: {
    completeSuccess: completeSuccessMock,
    completeFailure: completeFailureMock,
    createRunning: createRunningMock,
    findById: findByIdMock,
    cancel: cancelMock,
  },
}));

import { createDbRunStore } from "../../src/internal/runner/persistence/run-store.js";

const buildStoredRun = (completedAt: Date | null) => ({
  runId: 1,
  workspaceId: 2,
  initiatedByUserId: 3,
  status: completedAt ? ("completed" as const) : ("running" as const),
  startedAt: new Date("2026-01-01T00:00:00.000Z"),
  completedAt,
  durationMs: 10,
  request: {
    method: "GET" as const,
    url: "https://api.example.com",
    headers: [],
    queryParams: [],
    body: null,
    auth: { type: "none" as const },
    resolvedVariables: {},
    timeoutMs: 1000,
  },
  response: {
    status: 200,
    headers: {},
    body: "{}",
    bodyBase64: "e30=",
    truncated: false,
    sizeBytes: 2,
  },
  error: null,
});

describe("db run store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("respects persistBinaryBodies option", async () => {
    const store = createDbRunStore({
      retentionDays: 30,
      persistBinaryBodies: false,
    });

    completeSuccessMock.mockResolvedValue(buildStoredRun(new Date()));

    await store.completeSuccess(1, {
      status: 200,
      headers: {},
      body: "plain",
      bodyBase64: "YmluYXJ5",
      truncated: false,
      sizeBytes: 6,
    });

    expect(completeSuccessMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ bodyBase64: null }),
    );
  });

  it("hides expired runs based on retentionDays", async () => {
    const store = createDbRunStore({
      retentionDays: 1,
      persistBinaryBodies: true,
    });

    findByIdMock.mockResolvedValue(
      buildStoredRun(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    );

    await expect(store.findById(1)).resolves.toBeUndefined();
  });

  it("does not cancel expired runs", async () => {
    const store = createDbRunStore({
      retentionDays: 1,
      persistBinaryBodies: true,
    });

    findByIdMock.mockResolvedValue(
      buildStoredRun(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    );

    await expect(store.cancel(1)).resolves.toBeUndefined();
    expect(cancelMock).not.toHaveBeenCalled();
  });
});
