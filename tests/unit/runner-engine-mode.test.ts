import { describe, expect, it, vi } from "vitest";

import { createRunnerEngine } from "../../src/internal/runner/core/runner-engine.js";
import { requestRunnerEngineDefaults } from "../../src/internal/runner/config/engine-config.js";

const input = {
  workspaceId: 1,
  initiatedByUserId: 2,
  source: {
    type: "adhoc" as const,
    request: {
      method: "GET" as const,
      url: "https://api.example.com/orders",
      headers: [],
      queryParams: [],
      body: null,
      auth: { type: "none" as const },
    },
  },
};

const buildRunning = () => ({
  runId: 10,
  workspaceId: 1,
  initiatedByUserId: 2,
  status: "running" as const,
  startedAt: new Date(),
  completedAt: null,
  durationMs: null,
  request: {
    method: "GET" as const,
    url: "https://api.example.com/orders",
    headers: [],
    queryParams: [],
    body: null,
    auth: { type: "none" as const },
    resolvedVariables: {},
    timeoutMs: 10000,
  },
  response: null,
  error: null,
});

const buildCompleted = () => ({
  ...buildRunning(),
  status: "completed" as const,
  completedAt: new Date(),
  durationMs: 15,
  response: {
    status: 200,
    headers: {},
    body: "{}",
    bodyBase64: null,
    truncated: false,
    sizeBytes: 2,
  },
});

describe("runner engine mode", () => {
  it("returns running immediately in async mode and completes in background", async () => {
    const createRunning = vi.fn().mockResolvedValue(buildRunning());
    const completeSuccess = vi.fn().mockResolvedValue(buildCompleted());
    const engine = createRunnerEngine({
      config: {
        ...requestRunnerEngineDefaults,
        mode: "async",
      },
      runStore: {
        createRunning,
        completeSuccess,
        completeFailure: vi.fn(),
        findById: vi.fn(),
        cancel: vi.fn(),
      },
      executeHttpRequest: vi.fn().mockResolvedValue({
        status: 200,
        headers: {},
        bodyBytes: new TextEncoder().encode("{}"),
      }),
    });

    const result = await engine.runRequest(input);

    expect(result.status).toBe("running");
    expect(createRunning).toHaveBeenCalledOnce();

    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(completeSuccess).toHaveBeenCalledOnce();
  });

  it("returns completed result in sync mode", async () => {
    const engine = createRunnerEngine({
      config: {
        ...requestRunnerEngineDefaults,
        mode: "sync",
      },
      runStore: {
        createRunning: vi.fn().mockResolvedValue(buildRunning()),
        completeSuccess: vi.fn().mockResolvedValue(buildCompleted()),
        completeFailure: vi.fn(),
        findById: vi.fn(),
        cancel: vi.fn(),
      },
      executeHttpRequest: vi.fn().mockResolvedValue({
        status: 200,
        headers: {},
        bodyBytes: new TextEncoder().encode("{}"),
      }),
    });

    const result = await engine.runRequest(input);
    expect(result.status).toBe("completed");
  });
});
