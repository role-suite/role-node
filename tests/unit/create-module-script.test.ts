import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { afterEach, describe, expect, it } from "vitest";

const testDirs: string[] = [];

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../scripts/create-module.mjs",
);

const runScript = (cwd: string, moduleName?: string) => {
  const args = [scriptPath];

  if (moduleName) {
    args.push(moduleName);
  }

  return spawnSync("node", args, {
    cwd,
    encoding: "utf8",
  });
};

describe("create-module script", () => {
  afterEach(async () => {
    await Promise.all(
      testDirs.map((dir) => rm(dir, { recursive: true, force: true })),
    );
    testDirs.length = 0;
  });

  it("creates module and test templates", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "role-node-module-"));
    testDirs.push(root);

    const result = runScript(root, "audit-logs");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "Created module template for 'audit-logs'.",
    );

    const routeFile = path.join(
      root,
      "src/modules/audit-logs/audit-logs.route.ts",
    );
    const serviceTestFile = path.join(
      root,
      "tests/unit/audit-logs.service.test.ts",
    );

    const routeContents = await readFile(routeFile, "utf8");
    const serviceTestContents = await readFile(serviceTestFile, "utf8");

    expect(routeContents).toContain("export const auditLogsRouter = Router();");
    expect(routeContents).toContain(
      'auditLogsRouter.post("/", auditLogsController.create);',
    );
    expect(serviceTestContents).toContain('describe("audit-logs service"');
  });

  it("fails for invalid module name", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "role-node-module-"));
    testDirs.push(root);

    const result = runScript(root, "AuditLogs");

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Module name must match");
  });

  it("fails when files already exist", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "role-node-module-"));
    testDirs.push(root);

    const first = runScript(root, "reports");
    const second = runScript(root, "reports");

    expect(first.status).toBe(0);
    expect(second.status).toBe(1);
    expect(second.stderr).toContain("EEXIST");
  });
});
