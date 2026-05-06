import { beforeEach, describe, expect, it, vi } from "vitest";

const baseEnv = {
  NODE_ENV: "test",
  PORT: "3000",
  GRPC_ENABLED: "false",
  GRPC_PORT: "50051",
  GRPC_TLS_ENABLED: "false",
  GRPC_MTLS_ENABLED: "false",
  DB_DIALECT: "postgres",
  DB_HOST: "localhost",
  DB_PORT: "5432",
  DB_USER: "postgres",
  DB_PASSWORD: "postgres",
  DB_NAME: "postgres",
  DB_POOL_MIN: "0",
  DB_POOL_MAX: "10",
  DB_SSL: "false",
  ENABLE_STARTUP_VALIDATION: "false",
  OTEL_ENABLED: "true",
  OTEL_SERVICE_NAME: "role-node",
  OTEL_SERVICE_VERSION: "1.0.0",
  OTEL_EXPORTER_OTLP_ENDPOINT: "http://localhost:4318",
  OTEL_METRICS_EXPORT_INTERVAL_MS: "30000",
  OTEL_TRACES_SAMPLER: "ratio",
  OTEL_TRACES_SAMPLER_RATIO: "0.5",
  AUTH_ACCESS_TOKEN_SECRET: "dev-access-secret-change-me",
  AUTH_REFRESH_TOKEN_SECRET: "dev-refresh-secret-change-me",
  AUTH_ACCESS_TOKEN_TTL_SECONDS: "900",
  AUTH_REFRESH_TOKEN_TTL_SECONDS: "604800",
};

describe("env telemetry validation", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("accepts valid OTEL ratio sampler bounds", async () => {
    vi.stubEnv("OTEL_TRACES_SAMPLER", "ratio");
    vi.stubEnv("OTEL_TRACES_SAMPLER_RATIO", "1");
    Object.entries(baseEnv).forEach(([key, value]) => vi.stubEnv(key, value));

    const { env } = await import("../../src/config/env.js");

    expect(env.OTEL_TRACES_SAMPLER).toBe("ratio");
    expect(env.OTEL_TRACES_SAMPLER_RATIO).toBe(0.5);
  });

  it("fails when OTEL ratio sampler is above 1", async () => {
    Object.entries({
      ...baseEnv,
      OTEL_TRACES_SAMPLER_RATIO: "1.5",
    }).forEach(([key, value]) => vi.stubEnv(key, value));

    const exitSpy = vi.spyOn(process, "exit").mockImplementation(((
      code?: number,
    ) => {
      throw new Error(`exit:${code ?? ""}`);
    }) as never);

    await expect(import("../../src/config/env.js")).rejects.toThrow("exit:1");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("fails when OTEL ratio sampler is below 0", async () => {
    Object.entries({
      ...baseEnv,
      OTEL_TRACES_SAMPLER_RATIO: "-0.1",
    }).forEach(([key, value]) => vi.stubEnv(key, value));

    vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
      throw new Error(`exit:${code ?? ""}`);
    }) as never);

    await expect(import("../../src/config/env.js")).rejects.toThrow("exit:1");
  });
});
