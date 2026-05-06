import { describe, expect, it, vi } from "vitest";

const loadBuildTraceSampler = async (overrides: {
  OTEL_TRACES_SAMPLER: "always_on" | "always_off" | "ratio";
  OTEL_TRACES_SAMPLER_RATIO?: number;
}) => {
  vi.resetModules();
  vi.doMock("../../src/config/env.js", () => ({
    env: {
      OTEL_ENABLED: true,
      OTEL_SERVICE_NAME: "role-node",
      OTEL_SERVICE_VERSION: "1.0.0",
      OTEL_EXPORTER_OTLP_ENDPOINT: "http://localhost:4318",
      OTEL_METRICS_EXPORT_INTERVAL_MS: 30000,
      NODE_ENV: "test",
      OTEL_TRACES_SAMPLER: overrides.OTEL_TRACES_SAMPLER,
      OTEL_TRACES_SAMPLER_RATIO: overrides.OTEL_TRACES_SAMPLER_RATIO ?? 1,
    },
  }));

  const module = await import("../../src/shared/telemetry.js");
  return module.buildTraceSampler;
};

describe("telemetry sampler", () => {
  it("builds always-on sampler", async () => {
    const buildTraceSampler = await loadBuildTraceSampler({
      OTEL_TRACES_SAMPLER: "always_on",
    });

    expect(buildTraceSampler().toString()).toContain("AlwaysOnSampler");
  });

  it("builds always-off sampler", async () => {
    const buildTraceSampler = await loadBuildTraceSampler({
      OTEL_TRACES_SAMPLER: "always_off",
    });

    expect(buildTraceSampler().toString()).toContain("AlwaysOffSampler");
  });

  it("builds ratio-based parent sampler", async () => {
    const buildTraceSampler = await loadBuildTraceSampler({
      OTEL_TRACES_SAMPLER: "ratio",
      OTEL_TRACES_SAMPLER_RATIO: 0.25,
    });

    expect(buildTraceSampler().toString()).toContain("ParentBased{root=TraceIdRatioBased");
  });
});
