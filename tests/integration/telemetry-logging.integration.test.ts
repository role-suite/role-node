import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

const originalNodeEnv = process.env.NODE_ENV;

const loadProductionAppWithTrace = async () => {
  vi.resetModules();
  process.env.NODE_ENV = "production";
  vi.doMock("@opentelemetry/api", () => ({
    SpanStatusCode: {
      OK: "OK",
      ERROR: "ERROR",
    },
    metrics: {
      getMeter: () => ({
        createHistogram: () => ({ record: () => undefined }),
        createCounter: () => ({ add: () => undefined }),
      }),
    },
    trace: {
      getTracer: () => ({
        startActiveSpan: async (
          _name: string,
          callback: (span: {
            setAttribute: (key: string, value: unknown) => void;
            setStatus: (status: unknown) => void;
            recordException: (error: unknown) => void;
            end: () => void;
          }) => Promise<unknown>,
        ) =>
          callback({
            setAttribute: () => undefined,
            setStatus: () => undefined,
            recordException: () => undefined,
            end: () => undefined,
          }),
      }),
      getActiveSpan: () => ({
        spanContext: () => ({
          traceId: "trace-integration-123",
          spanId: "span-integration-456",
        }),
      }),
    },
  }));

  return import("../../src/app.js");
};

describe("telemetry logging integration", () => {
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("emits production request log with request and trace correlation", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { app } = await loadProductionAppWithTrace();

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    const requestId = response.headers["x-request-id"] as string;
    expect(requestId).toBeTypeOf("string");

    const serializedLog = logSpy.mock.calls
      .map((call) => String(call[0]))
      .find((entry) => {
        try {
          const parsed = JSON.parse(entry) as { message?: string };
          return parsed.message === "HTTP request completed";
        } catch {
          return false;
        }
      });

    expect(serializedLog).toBeDefined();
    const parsed = JSON.parse(String(serializedLog)) as {
      message: string;
      requestId?: string;
      traceId?: string;
      spanId?: string;
    };

    expect(parsed.message).toBe("HTTP request completed");
    expect(parsed.requestId).toBe(requestId);
    expect(parsed.traceId).toBe("trace-integration-123");
    expect(parsed.spanId).toBe("span-integration-456");
  });
});
