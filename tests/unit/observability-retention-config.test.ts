import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("observability retention and cardinality config", () => {
  it("configures Prometheus retention time and size budget", async () => {
    const composePath = resolve(process.cwd(), "docker-compose.yml");
    const compose = await readFile(composePath, "utf-8");

    expect(compose).toContain("--storage.tsdb.retention.time=15d");
    expect(compose).toContain("--storage.tsdb.retention.size=5GB");
  });

  it("configures Loki retention and label limits", async () => {
    const lokiPath = resolve(
      process.cwd(),
      "config/observability/loki/loki.yaml",
    );
    const loki = await readFile(lokiPath, "utf-8");

    expect(loki).toContain("retention_period: 168h");
    expect(loki).toContain("max_label_names_per_series: 20");
    expect(loki).toContain("max_entries_limit_per_query: 5000");
  });
});
