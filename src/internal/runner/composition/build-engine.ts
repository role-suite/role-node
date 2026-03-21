import type { RequestRunnerEngineConfig } from "../config/engine-config.js";
import {
  createRunnerEngine,
  type RunnerEngine,
} from "../core/runner-engine.js";
import { moduleRegistry } from "./module-registry.js";

export const buildEngine = (
  config: RequestRunnerEngineConfig,
): RunnerEngine => {
  const runStoreFactory = moduleRegistry.runStore[config.modules.runStore];

  if (!runStoreFactory) {
    throw new Error(
      `Unsupported run store module key: ${config.modules.runStore}`,
    );
  }

  const runStore = runStoreFactory();

  return createRunnerEngine({
    config,
    runStore,
  });
};
