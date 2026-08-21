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
    expect(dockerfile).toContain("http://127.0.0.1:3000/health");
  });
});
