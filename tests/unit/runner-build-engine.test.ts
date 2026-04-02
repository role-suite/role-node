import { describe, expect, it } from "vitest";

import { buildEngine } from "../../src/internal/runner/composition/build-engine.js";
import { requestRunnerEngineDefaults } from "../../src/internal/runner/config/engine-config.js";

describe("runner build engine", () => {
  it("builds engine with default modules", () => {
    const engine = buildEngine(requestRunnerEngineDefaults);

    expect(engine.runRequest).toBeTypeOf("function");
    expect(engine.getRunById).toBeTypeOf("function");
    expect(engine.cancelRun).toBeTypeOf("function");
  });

  it("builds engine when http client is node-fetch", () => {
    const config = {
      ...requestRunnerEngineDefaults,
      execution: {
        ...requestRunnerEngineDefaults.execution,
        httpClient: "node-fetch" as const,
      },
    };

    const engine = buildEngine(config);
    expect(engine.runRequest).toBeTypeOf("function");
  });

  it("throws for unsupported module keys", () => {
    const invalid = {
      ...requestRunnerEngineDefaults,
      modules: {
        ...requestRunnerEngineDefaults.modules,
        runStore: "invalid-key",
      },
    } as unknown as typeof requestRunnerEngineDefaults;

    expect(() => buildEngine(invalid)).toThrow(
      "Unsupported run store module key: invalid-key",
    );
  });
});
