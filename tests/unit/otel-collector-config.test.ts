import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("otel collector config", () => {
  it("includes tail-sampling policies for errors and slow traces", async () => {
    const configPath = resolve(
      process.cwd(),
      "config/observability/otel-collector/config.yaml",
    );
    const config = await readFile(configPath, "utf-8");

    expect(config).toContain("tail_sampling:");
    expect(config).toContain("name: keep-errors");
    expect(config).toContain("status_codes: [ERROR]");
    expect(config).toContain("name: keep-slow-traces");
    expect(config).toContain("threshold_ms: 500");
    expect(config).toContain("name: baseline-ratio");
    expect(config).toContain("sampling_percentage: 10");
  });

  it("keeps redaction processor in all telemetry pipelines", async () => {
    const configPath = resolve(
      process.cwd(),
      "config/observability/otel-collector/config.yaml",
    );
    const config = await readFile(configPath, "utf-8");

    expect(config).toContain("attributes/redact:");
    expect(config).toContain(
      "processors: [memory_limiter, attributes/redact, tail_sampling, batch]",
    );
    expect(config).toContain(
      "processors: [memory_limiter, attributes/redact, batch]",
    );
    expect(config).not.toContain(
      "processors: [memory_limiter, tail_sampling, batch]",
    );
  });
});
