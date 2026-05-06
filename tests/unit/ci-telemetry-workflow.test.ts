import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("ci telemetry workflow", () => {
  it("includes telemetry verification scripts in package.json", async () => {
    const packageJsonPath = resolve(process.cwd(), "package.json");
    const content = await readFile(packageJsonPath, "utf-8");
    const parsed = JSON.parse(content) as {
      scripts: Record<string, string>;
    };

    expect(parsed.scripts["telemetry:test"]).toBeDefined();
    expect(parsed.scripts["telemetry:validate"]).toBeDefined();
    expect(parsed.scripts["verify:telemetry"]).toBeDefined();
    expect(parsed.scripts.verify).toContain("pnpm verify:telemetry");
  });

  it("requires telemetry job in CI status gate", async () => {
    const workflowPath = resolve(process.cwd(), ".github/workflows/ci.yml");
    const workflow = await readFile(workflowPath, "utf-8");

    expect(workflow).toContain("name: 4.5 Telemetry");
    expect(workflow).toContain("run: pnpm telemetry:test");
    expect(workflow).toContain("run: pnpm telemetry:validate");
    expect(workflow).toContain("needs: [format, lint, contract-check, grpc-impact, test, telemetry, build]");
    expect(workflow).toContain("needs.telemetry.result");
  });
});
