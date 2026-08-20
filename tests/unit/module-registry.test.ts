import { describe, expect, it } from "vitest";

import { moduleRegistry } from "../../src/internal/runner/composition/module-registry.js";
import { requestRunnerEngineDefaults } from "../../src/internal/runner/config/engine-config.js";

describe("moduleRegistry", () => {
  describe("runStore", () => {
    it("has postgres factory", () => {
      const config = requestRunnerEngineDefaults;

      const factory = moduleRegistry.runStore.postgres;

      expect(factory).toBeDefined();
      expect(typeof factory).toBe("function");
      const store = factory(config);
      expect(store).toBeDefined();
      expect(store.createRunning).toBeDefined();
      expect(store.completeSuccess).toBeDefined();
      expect(store.findById).toBeDefined();
    });
  });

  describe("httpExecutor", () => {
    it("creates undici executor", () => {
      const executor = moduleRegistry.httpExecutor.undici;

      expect(executor).toBeDefined();
      expect(typeof executor).toBe("function");
    });

    it("creates node-fetch executor", () => {
      const executor = moduleRegistry.httpExecutor["node-fetch"];

      expect(executor).toBeDefined();
      expect(typeof executor).toBe("function");
    });
  });

  describe("networkPolicy", () => {
    it("has default network policy", () => {
      expect(moduleRegistry.networkPolicy.default).toBeDefined();
      expect(typeof moduleRegistry.networkPolicy.default).toBe("function");
    });
  });

  describe("limitsPolicy", () => {
    it("has default limits policy", () => {
      expect(moduleRegistry.limitsPolicy.default).toBeDefined();
      expect(
        moduleRegistry.limitsPolicy.default.resolveRunOptions,
      ).toBeDefined();
      expect(
        moduleRegistry.limitsPolicy.default.assertRequestLimits,
      ).toBeDefined();
    });
  });

  describe("redactionPolicy", () => {
    it("has default redaction policy", () => {
      expect(moduleRegistry.redactionPolicy.default).toBeDefined();
      expect(
        moduleRegistry.redactionPolicy.default.redactRequestSnapshot,
      ).toBeDefined();
      expect(
        moduleRegistry.redactionPolicy.default.redactResponseSnapshot,
      ).toBeDefined();
    });
  });
});
