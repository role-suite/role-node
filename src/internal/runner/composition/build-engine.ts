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
  const networkPolicy =
    moduleRegistry.networkPolicy[config.modules.networkPolicy];
  const limitsPolicy = moduleRegistry.limitsPolicy[config.modules.limitsPolicy];
  const redactionPolicy =
    moduleRegistry.redactionPolicy[config.modules.redactionPolicy];
  const httpExecutor = moduleRegistry.httpExecutor[config.execution.httpClient];

  if (!runStoreFactory) {
    throw new Error(
      `Unsupported run store module key: ${config.modules.runStore}`,
    );
  }

  if (!networkPolicy) {
    throw new Error(
      `Unsupported network policy module key: ${config.modules.networkPolicy}`,
    );
  }

  if (!limitsPolicy) {
    throw new Error(
      `Unsupported limits policy module key: ${config.modules.limitsPolicy}`,
    );
  }

  if (!redactionPolicy) {
    throw new Error(
      `Unsupported redaction policy module key: ${config.modules.redactionPolicy}`,
    );
  }

  if (!httpExecutor) {
    throw new Error(
      `Unsupported HTTP executor key: ${config.execution.httpClient}`,
    );
  }

  const runStore = runStoreFactory(config);

  return createRunnerEngine({
    config,
    runStore,
    executeHttpRequest: httpExecutor,
    assertNetworkPolicy: networkPolicy,
    resolveRunOptions: limitsPolicy.resolveRunOptions,
    assertRequestLimits: limitsPolicy.assertRequestLimits,
    redactRequestSnapshot: redactionPolicy.redactRequestSnapshot,
    redactResponseSnapshot: redactionPolicy.redactResponseSnapshot,
  });
};
