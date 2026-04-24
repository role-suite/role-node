import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { allContracts } from "../../contracts/index.js";
import { buildOpenApiSchema } from "../../scripts/contracts/openapi-utils.js";

const testDirs: string[] = [];

const scriptsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../scripts/contracts",
);
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const tsxBinaryPath = path.resolve(repoRoot, "node_modules/.bin/tsx");
const ciWorkflowPath = path.join(repoRoot, ".github/workflows/ci.yml");

const runContractScript = (cwd: string, scriptName: string) => {
  return spawnSync(tsxBinaryPath, [path.join(scriptsDir, scriptName)], {
    cwd,
    encoding: "utf8",
  });
};

const createTempProjectRoot = async () => {
  const root = await mkdtemp(path.join(tmpdir(), "role-node-openapi-"));
  testDirs.push(root);
  return root;
};

describe("OpenAPI contract tools", () => {
  afterEach(async () => {
    await Promise.all(
      testDirs.map((dir) => rm(dir, { recursive: true, force: true })),
    );
    testDirs.length = 0;
  });

  it("builds OpenAPI paths with operationId, tags, bearerAuth, and schemas", () => {
    const openApi = buildOpenApiSchema();

    expect(openApi.openapi).toBe("3.1.0");
    expect(openApi.components.securitySchemes.bearerAuth).toEqual({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    });

    expect(openApi.paths["/api/workspaces/:workspaceId"]).toBeUndefined();

    const workspaceByIdGet = openApi.paths["/api/workspaces/{workspaceId}"]?.get;
    expect(workspaceByIdGet).toBeDefined();
    expect(workspaceByIdGet?.operationId).toBe("getApiWorkspacesByWorkspaceId");
    expect(workspaceByIdGet?.tags).toEqual(["workspaces"]);
    expect(workspaceByIdGet?.security).toEqual([{ bearerAuth: [] }]);
    expect(workspaceByIdGet?.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "workspaceId",
          in: "path",
          required: true,
        }),
      ]),
    );
    expect(workspaceByIdGet?.responses["200"]?.content["application/json"]?.schema).toBeDefined();

    const authLoginPost = openApi.paths["/api/auth/login"]?.post;
    expect(authLoginPost).toBeDefined();
    expect(authLoginPost?.security).toBeUndefined();
    expect(authLoginPost?.requestBody?.content["application/json"]?.schema).toBeDefined();
    expect(authLoginPost?.responses["200"]?.content["application/json"]?.schema).toBeDefined();
  });

  it("maps every contract endpoint and auth requirement into OpenAPI", () => {
    const openApi = buildOpenApiSchema();
    const operationIds = new Set<string>();

    for (const contract of allContracts) {
      const openApiPath = contract.path.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
      const operation = openApi.paths[openApiPath]?.[contract.method.toLowerCase()];

      expect(operation).toBeDefined();

      if (!operation) {
        continue;
      }

      expect(operation.operationId).toBeTruthy();
      expect(operationIds.has(operation.operationId)).toBe(false);
      operationIds.add(operation.operationId);

      if (contract.auth === "bearer") {
        expect(operation.security).toEqual([{ bearerAuth: [] }]);
      } else {
        expect(operation.security).toBeUndefined();
      }
    }

    expect(operationIds.size).toBe(allContracts.length);
  });

  it("includes query parameters and required path parameters", () => {
    const openApi = buildOpenApiSchema();
    const updatesOperation =
      openApi.paths["/api/workspaces/{workspaceId}/updates"]?.get;

    expect(updatesOperation).toBeDefined();
    expect(updatesOperation?.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "workspaceId",
          in: "path",
          required: true,
        }),
        expect.objectContaining({
          name: "since",
          in: "query",
        }),
        expect.objectContaining({
          name: "limit",
          in: "query",
        }),
      ]),
    );
  });

  it("exports OpenAPI artifact to contracts/generated/openapi.json", async () => {
    const root = await createTempProjectRoot();

    const result = runContractScript(root, "export-openapi.ts");

    expect(result.status).toBe(0);

    const outputPath = path.join(root, "contracts/generated/openapi.json");
    const exported = JSON.parse(await readFile(outputPath, "utf8")) as {
      paths: Record<string, unknown>;
    };

    expect(exported.paths["/api/workspaces/{workspaceId}"]).toBeDefined();
  });

  it("fails OpenAPI drift check when artifact is missing", async () => {
    const root = await createTempProjectRoot();

    const result = runContractScript(root, "openapi-check.ts");

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("OpenAPI artifact not found");
  });

  it("detects stale OpenAPI artifact and passes after regeneration", async () => {
    const root = await createTempProjectRoot();
    const generatedDir = path.join(root, "contracts/generated");

    await mkdir(generatedDir, { recursive: true });
    await writeFile(path.join(generatedDir, "openapi.json"), "{}\n", "utf8");

    const staleResult = runContractScript(root, "openapi-check.ts");
    expect(staleResult.status).toBe(1);
    expect(staleResult.stderr).toContain("OpenAPI drift detected.");

    const generateResult = runContractScript(root, "export-openapi.ts");
    expect(generateResult.status).toBe(0);

    const freshResult = runContractScript(root, "openapi-check.ts");
    expect(freshResult.status).toBe(0);
    expect(freshResult.stdout).toContain("OpenAPI artifact is up to date.");
  });

  it("lints OpenAPI governance and reports invalid artifact fields", async () => {
    const root = await createTempProjectRoot();
    const generatedDir = path.join(root, "contracts/generated");

    await mkdir(generatedDir, { recursive: true });

    const invalidArtifact = {
      openapi: "3.0.0",
      info: {
        title: "invalid",
        version: "0.0.0",
      },
      paths: {
        "/api/workspaces/{workspaceId}": {
          get: {
            tags: [],
            responses: {},
            parameters: [],
          },
        },
      },
      components: {
        securitySchemes: {},
      },
    };

    await writeFile(
      path.join(generatedDir, "openapi.json"),
      `${JSON.stringify(invalidArtifact, null, 2)}\n`,
      "utf8",
    );

    const lintInvalid = runContractScript(root, "openapi-lint.ts");
    expect(lintInvalid.status).toBe(1);
    expect(lintInvalid.stderr).toContain("Expected openapi version 3.1.0");
    expect(lintInvalid.stderr).toContain(
      "Missing components.securitySchemes.bearerAuth.",
    );
    expect(lintInvalid.stderr).toContain("is missing operationId.");
    expect(lintInvalid.stderr).toContain("is missing tags.");
    expect(lintInvalid.stderr).toContain("is missing responses.");
    expect(lintInvalid.stderr).toContain(
      "is missing required path parameter workspaceId.",
    );

    const generateResult = runContractScript(root, "export-openapi.ts");
    expect(generateResult.status).toBe(0);

    const lintValid = runContractScript(root, "openapi-lint.ts");
    expect(lintValid.status).toBe(0);
    expect(lintValid.stdout).toContain("OpenAPI lint passed.");
  });

  it("reports duplicate operationId during OpenAPI lint", async () => {
    const root = await createTempProjectRoot();
    const generatedDir = path.join(root, "contracts/generated");

    await mkdir(generatedDir, { recursive: true });

    const duplicateOperationArtifact = {
      openapi: "3.1.0",
      info: {
        title: "role-node API",
        version: "1.0.0",
      },
      paths: {
        "/api/auth/login": {
          post: {
            operationId: "dupOperation",
            tags: ["auth"],
            responses: {
              "200": {
                description: "ok",
              },
            },
          },
        },
        "/api/auth/refresh": {
          post: {
            operationId: "dupOperation",
            tags: ["auth"],
            responses: {
              "200": {
                description: "ok",
              },
            },
          },
        },
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      tags: [{ name: "auth" }],
    };

    await writeFile(
      path.join(generatedDir, "openapi.json"),
      `${JSON.stringify(duplicateOperationArtifact, null, 2)}\n`,
      "utf8",
    );

    const lintResult = runContractScript(root, "openapi-lint.ts");
    expect(lintResult.status).toBe(1);
    expect(lintResult.stderr).toContain("reuses duplicate operationId");
  });

  it("reports invalid bearerAuth security scheme during lint", async () => {
    const root = await createTempProjectRoot();
    const generatedDir = path.join(root, "contracts/generated");

    await mkdir(generatedDir, { recursive: true });

    const invalidBearerArtifact = {
      openapi: "3.1.0",
      info: {
        title: "role-node API",
        version: "1.0.0",
      },
      paths: {
        "/health": {
          get: {
            operationId: "getHealth",
            tags: ["api"],
            responses: {
              "200": {
                description: "ok",
              },
            },
          },
        },
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "apiKey",
            scheme: "token",
          },
        },
      },
      tags: [{ name: "api" }],
    };

    await writeFile(
      path.join(generatedDir, "openapi.json"),
      `${JSON.stringify(invalidBearerArtifact, null, 2)}\n`,
      "utf8",
    );

    const lintResult = runContractScript(root, "openapi-lint.ts");
    expect(lintResult.status).toBe(1);
    expect(lintResult.stderr).toContain(
      "components.securitySchemes.bearerAuth.type must be http.",
    );
    expect(lintResult.stderr).toContain(
      "components.securitySchemes.bearerAuth.scheme must be bearer.",
    );
  });

  it("declares OpenAPI script entrypoints in package.json", async () => {
    const packageJsonPath = path.join(repoRoot, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts["contracts:openapi:generate"]).toBe(
      "tsx scripts/contracts/export-openapi.ts",
    );
    expect(packageJson.scripts["contracts:openapi:check"]).toBe(
      "tsx scripts/contracts/openapi-check.ts",
    );
    expect(packageJson.scripts["contracts:openapi:lint"]).toBe(
      "tsx scripts/contracts/openapi-lint.ts",
    );
  });

  it("enforces OpenAPI quality gates in CI contract-check job", async () => {
    const ciWorkflow = await readFile(ciWorkflowPath, "utf8");

    expect(ciWorkflow).toContain("- name: Generate OpenAPI artifact");
    expect(ciWorkflow).toContain("run: pnpm contracts:openapi:generate");

    expect(ciWorkflow).toContain("- name: Check OpenAPI drift");
    expect(ciWorkflow).toContain("run: pnpm contracts:openapi:check");

    expect(ciWorkflow).toContain("- name: Lint OpenAPI artifact");
    expect(ciWorkflow).toContain("run: pnpm contracts:openapi:lint");

    expect(ciWorkflow).toContain("- name: Upload OpenAPI artifact");
    expect(ciWorkflow).toContain("name: openapi-artifact");
    expect(ciWorkflow).toContain("path: contracts/generated/openapi.json");

    const generateIndex = ciWorkflow.indexOf(
      "- name: Generate OpenAPI artifact",
    );
    const checkIndex = ciWorkflow.indexOf("- name: Check OpenAPI drift");
    const lintIndex = ciWorkflow.indexOf("- name: Lint OpenAPI artifact");

    expect(generateIndex).toBeGreaterThan(-1);
    expect(checkIndex).toBeGreaterThan(generateIndex);
    expect(lintIndex).toBeGreaterThan(checkIndex);
  });
});
