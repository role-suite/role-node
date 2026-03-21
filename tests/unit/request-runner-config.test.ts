import { afterEach, describe, expect, it } from "vitest";

import {
  requestRunnerEngineConfigSchema,
  requestRunnerEngineDefaults,
} from "../../src/internal/runner/config/engine-config.js";
import { applyEngineConfigEnvOverrides } from "../../src/internal/runner/config/engine-config-loader.js";

const originalEnv = { ...process.env };

describe("request runner engine config", () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("parses default config", () => {
    const parsed = requestRunnerEngineConfigSchema.parse(
      requestRunnerEngineDefaults,
    );

    expect(parsed.mode).toBe("sync");
    expect(parsed.limits.timeoutMsDefault).toBe(10000);
  });

  it("applies environment overrides", () => {
    process.env.RUNNER_TIMEOUT_MS_DEFAULT = "15000";
    process.env.RUNNER_ALLOW_HTTP = "false";

    const overridden = applyEngineConfigEnvOverrides(
      requestRunnerEngineDefaults,
    );

    expect(overridden.limits.timeoutMsDefault).toBe(15000);
    expect(overridden.policy.allowHttp).toBe(false);
  });
});
