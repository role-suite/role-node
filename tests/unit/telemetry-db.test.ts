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

import { withDbQueryTelemetry } from "../../src/shared/db/telemetry-db.js";

describe("telemetry-db", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records successful db query metrics and span attributes", async () => {
    const result = await withDbQueryTelemetry(
      "postgres",
      "select * from users",
      2,
      async () => ({ rows: [] }),
    );

    expect(result).toEqual({ rows: [] });
    expect(telemetryState.span.setAttribute).toHaveBeenCalledWith(
      "db.operation.name",
      "SELECT",
    );
    expect(telemetryState.span.setAttribute).toHaveBeenCalledWith(
      "db.query.parameter_count",
      2,
    );
    expect(telemetryState.counterAdd).toHaveBeenCalledWith(1, {
      dialect: "postgres",
      operation: "SELECT",
      outcome: "success",
    });
    expect(telemetryState.span.setStatus).toHaveBeenCalledWith({ code: "OK" });
  });

  it("records error outcome and rethrows", async () => {
    const failure = new Error("db failed");

    await expect(
      withDbQueryTelemetry(
        "mysql",
        "update users set name = ?",
        1,
        async () => {
          throw failure;
        },
      ),
    ).rejects.toThrow("db failed");

    expect(telemetryState.counterAdd).toHaveBeenCalledWith(1, {
      dialect: "mysql",
      operation: "UPDATE",
      outcome: "error",
    });
    expect(telemetryState.span.recordException).toHaveBeenCalledWith(failure);
    expect(telemetryState.span.setStatus).toHaveBeenCalledWith({
      code: "ERROR",
    });
  });

  it("falls back to UNKNOWN operation for blank SQL", async () => {
    await withDbQueryTelemetry("postgres", "   ", 0, async () => ({
      ok: true,
    }));

    expect(telemetryState.span.setAttribute).toHaveBeenCalledWith(
      "db.operation.name",
      "UNKNOWN",
    );
    expect(telemetryState.counterAdd).toHaveBeenCalledWith(1, {
      dialect: "postgres",
      operation: "UNKNOWN",
      outcome: "success",
    });
  });

  it("records negative parameter counts without crashing", async () => {
    await withDbQueryTelemetry("mysql", "select 1", -3, async () => ({
      ok: true,
    }));

    expect(telemetryState.span.setAttribute).toHaveBeenCalledWith(
      "db.query.parameter_count",
      -3,
    );
  });
});
