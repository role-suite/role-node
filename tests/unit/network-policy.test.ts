import { describe, expect, it } from "vitest";

import {
  requestRunnerEngineDefaults,
  type RequestRunnerEngineConfig,
} from "../../src/internal/runner/config/engine-config.js";
import { RunnerError } from "../../src/internal/runner/errors/runner-errors.js";
import { assertNetworkPolicy } from "../../src/internal/runner/policy/network-policy.js";

const createConfig = (
  policy: Partial<RequestRunnerEngineConfig["policy"]> = {},
): RequestRunnerEngineConfig => ({
  ...requestRunnerEngineDefaults,
  policy: {
    ...requestRunnerEngineDefaults.policy,
    ...policy,
  },
});

const expectBlocked = (url: string, config = createConfig()): void => {
  expect(() => assertNetworkPolicy(url, config)).toThrow(RunnerError);
};

describe("network policy", () => {
  it("blocks localhost names and loopback IP ranges", () => {
    const config = createConfig();

    expectBlocked("http://localhost/status", config);
    expectBlocked("http://127.0.0.2/status", config);
    expectBlocked("http://[::1]/status", config);
  });

  it("blocks configured private IPv4 and IPv6 CIDR targets", () => {
    const config = createConfig();

    expectBlocked("http://10.1.2.3/status", config);
    expectBlocked("http://172.16.0.10/status", config);
    expectBlocked("http://172.31.255.255/status", config);
    expectBlocked("http://192.168.1.10/status", config);
    expectBlocked("http://[fd00::1]/status", config);
  });

  it("allows public targets outside configured CIDR ranges", () => {
    const config = createConfig();

    expect(() =>
      assertNetworkPolicy("https://203.0.113.10/status", config),
    ).not.toThrow();
    expect(() =>
      assertNetworkPolicy("https://api.example.com/status", config),
    ).not.toThrow();
  });

  it("enforces protocol policy", () => {
    expectBlocked("ftp://api.example.com/file", createConfig());
    expectBlocked(
      "http://api.example.com/status",
      createConfig({ allowHttp: false }),
    );
    expectBlocked(
      "https://api.example.com/status",
      createConfig({ allowHttps: false }),
    );
  });

  it("enforces exact and subdomain allowlist entries", () => {
    const config = createConfig({ domainAllowlist: ["example.com"] });

    expect(() =>
      assertNetworkPolicy("https://example.com/status", config),
    ).not.toThrow();
    expect(() =>
      assertNetworkPolicy("https://api.example.com/status", config),
    ).not.toThrow();
    expectBlocked("https://example.net/status", config);
  });
});
