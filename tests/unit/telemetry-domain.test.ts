import { beforeEach, describe, expect, it, vi } from "vitest";

const telemetryState = vi.hoisted(() => {
  const histogramRecord = vi.fn();
  const counterAdd = vi.fn();
  const setAttribute = vi.fn();
  const recordException = vi.fn();
  const setStatus = vi.fn();
  const end = vi.fn();

  const span = {
    setAttribute,
    recordException,
    setStatus,
    end,
  };

  return {
    histogramRecord,
    counterAdd,
    span,
  };
});

vi.mock("@opentelemetry/api", () => ({
  SpanStatusCode: {
    OK: "OK",
    ERROR: "ERROR",
  },
  metrics: {
    getMeter: () => ({
      createHistogram: () => ({ record: telemetryState.histogramRecord }),
      createCounter: () => ({ add: telemetryState.counterAdd }),
    }),
  },
  trace: {
    getTracer: () => ({
      startActiveSpan: async (
        _name: string,
        callback: (span: typeof telemetryState.span) => Promise<unknown>,
      ) => callback(telemetryState.span),
    }),
  },
}));

import {
  recordDomainMetric,
  sanitizeMetricLabelValue,
  withDomainSpan,
} from "../../src/shared/telemetry-domain.js";

describe("telemetry-domain", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records auth domain counter", () => {
    recordDomainMetric.auth("login", "success");

    expect(telemetryState.counterAdd).toHaveBeenCalledWith(1, {
      operation: "login",
      outcome: "success",
    });
  });

  it("maps overlong operation labels to 'other'", () => {
    recordDomainMetric.auth(`user_session_${"x".repeat(60)}`, "error");

    expect(telemetryState.counterAdd).toHaveBeenCalledWith(1, {
      operation: "other",
      outcome: "error",
    });
  });

  it("normalizes invalid metric label values to avoid high cardinality", () => {
    expect(sanitizeMetricLabelValue("login")).toBe("login");
    expect(sanitizeMetricLabelValue("Create Workspace")).toBe(
      "create_workspace",
    );
    expect(sanitizeMetricLabelValue("x".repeat(80))).toBe("other");
    expect(sanitizeMetricLabelValue("user:123:dynamic")).toBe(
      "user_123_dynamic",
    );
  });

  it("creates successful span and records duration metric", async () => {
    const result = await withDomainSpan(
      "auth",
      "login",
      { "auth.account_type": "team", ignored: undefined },
      async () => "ok",
    );

    expect(result).toBe("ok");
    expect(telemetryState.span.setAttribute).toHaveBeenCalledWith(
      "auth.account_type",
      "team",
    );
    expect(telemetryState.span.setStatus).toHaveBeenCalledWith({ code: "OK" });
    expect(telemetryState.histogramRecord).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        service: "auth",
        operation: "login",
        outcome: "success",
      }),
    );
    expect(telemetryState.span.end).toHaveBeenCalledOnce();
  });

  it("records error status and rethrows failures", async () => {
    const failure = new Error("boom");

    await expect(
      withDomainSpan("runs", "create", {}, async () => {
        throw failure;
      }),
    ).rejects.toThrow("boom");

    expect(telemetryState.span.recordException).toHaveBeenCalledWith(failure);
    expect(telemetryState.span.setStatus).toHaveBeenCalledWith({
      code: "ERROR",
    });
    expect(telemetryState.histogramRecord).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        service: "runs",
        operation: "create",
        outcome: "error",
      }),
    );
  });

  it("maps empty operation labels to 'other'", async () => {
    await withDomainSpan("auth", "   ", {}, async () => "ok");

    expect(telemetryState.histogramRecord).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        service: "auth",
        operation: "other",
        outcome: "success",
      }),
    );
  });
});
