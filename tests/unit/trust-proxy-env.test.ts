import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("TRUST_PROXY env parsing", () => {
  const originalValue = process.env.TRUST_PROXY;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env.TRUST_PROXY;
    } else {
      process.env.TRUST_PROXY = originalValue;
    }
  });

  it("defaults to false when unset", async () => {
    delete process.env.TRUST_PROXY;

    const { env } = await import("../../src/config/env.js");

    expect(env.TRUST_PROXY).toBe(false);
  });

  it("parses the literal string 'true' as boolean true", async () => {
    process.env.TRUST_PROXY = "true";

    const { env } = await import("../../src/config/env.js");

    expect(env.TRUST_PROXY).toBe(true);
  });

  it("parses a numeric string as a hop count", async () => {
    process.env.TRUST_PROXY = "1";

    const { env } = await import("../../src/config/env.js");

    expect(env.TRUST_PROXY).toBe(1);
  });

  it("passes through a non-numeric string such as an IP/CIDR list", async () => {
    process.env.TRUST_PROXY = "loopback, 10.0.0.0/8";

    const { env } = await import("../../src/config/env.js");

    expect(env.TRUST_PROXY).toBe("loopback, 10.0.0.0/8");
  });
});
