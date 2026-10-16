import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("runtime Dockerfile", () => {
  it("keeps the container healthcheck on the REST health endpoint", async () => {
    const dockerfile = await readFile(
      resolve(process.cwd(), "Dockerfile"),
      "utf8",
    );

    expect(dockerfile).toContain("HEALTHCHECK");
    expect(dockerfile).toContain("process.env.PORT ?? '3000'");
    expect(dockerfile).toContain("http://127.0.0.1:${port}/health");
  });

  it("ships the compiled migration CLI so deployed images can migrate", async () => {
    const dockerfile = await readFile(
      resolve(process.cwd(), "Dockerfile"),
      "utf8",
    );

    expect(dockerfile).toContain("pnpm build:migrations");
    expect(dockerfile).toContain("/app/dist-migrations ./dist-migrations");
    expect(dockerfile).toContain(
      "/app/dist-migrations/migrations ./migrations",
    );
  });

  it("strips the bundled npm and corepack from the runtime image", async () => {
    const dockerfile = await readFile(
      resolve(process.cwd(), "Dockerfile"),
      "utf8",
    );

    expect(dockerfile).toContain(
      "rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack",
    );
    expect(dockerfile).toContain(
      "rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack",
    );
  });
});
