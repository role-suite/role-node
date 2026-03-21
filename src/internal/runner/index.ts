import {
  loadRequestRunnerEngineConfig,
  resolveRunnerConfigPaths,
} from "./config/engine-config-loader.js";
import { buildEngine } from "./composition/build-engine.js";
import type { ExecuteRunInput, ExecuteRunResult } from "./core/types.js";

const createEngine = () => {
  try {
    const config = loadRequestRunnerEngineConfig();
    return buildEngine(config);
  } catch (error) {
    const { baseConfigPath } = resolveRunnerConfigPaths();
    throw new Error(
      `Failed to initialize request runner engine from ${baseConfigPath}`,
      {
        cause: error,
      },
    );
  }
};

const engine = createEngine();

export const runRequest = (
  input: ExecuteRunInput,
): Promise<ExecuteRunResult> => {
  return engine.runRequest(input);
};

export const getRunById = (
  workspaceId: number,
  runId: number,
): Promise<ExecuteRunResult | null> => {
  return engine.getRunById(workspaceId, runId);
};

export const cancelRun = (
  workspaceId: number,
  runId: number,
): Promise<ExecuteRunResult | null> => {
  return engine.cancelRun(workspaceId, runId);
};

export type { ExecuteRunInput, ExecuteRunResult } from "./core/types.js";
