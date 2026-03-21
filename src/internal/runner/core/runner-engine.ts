import type { RequestRunnerEngineConfig } from "../config/engine-config.js";
import { executeHttpRequest } from "../execution/http-client.js";
import { normalizeResponse } from "../execution/response-normalizer.js";
import { toRunnerPublicError } from "../errors/runner-errors.js";
import { resolveAuth } from "../planning/auth-resolver.js";
import {
  buildSourceRequest,
  buildVariableContext,
  resolveRunSourcePersistence,
} from "../planning/plan-builder.js";
import { resolveVariables } from "../planning/variable-resolver.js";
import {
  resolveRunOptions,
  assertRequestLimits,
} from "../policy/limits-policy.js";
import { assertNetworkPolicy } from "../policy/network-policy.js";
import {
  redactRequestSnapshot,
  redactResponseSnapshot,
} from "../policy/redaction-policy.js";
import type { RunStore } from "../persistence/run-store.js";
import { logger } from "../../../shared/logger.js";
import type { ExecuteRunInput, ExecuteRunResult } from "./types.js";

export type RunnerEngine = {
  runRequest(input: ExecuteRunInput): Promise<ExecuteRunResult>;
  getRunById(
    workspaceId: number,
    runId: number,
  ): Promise<ExecuteRunResult | null>;
  cancelRun(
    workspaceId: number,
    runId: number,
  ): Promise<ExecuteRunResult | null>;
};

export const createRunnerEngine = (deps: {
  config: RequestRunnerEngineConfig;
  runStore: RunStore;
}): RunnerEngine => {
  const { config, runStore } = deps;

  const resolveTargetHost = (url: string | undefined): string | null => {
    if (!url) {
      return null;
    }

    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  };

  return {
    async runRequest(input: ExecuteRunInput): Promise<ExecuteRunResult> {
      const startedAt = new Date();
      let targetHost: string | null =
        input.source.type === "adhoc"
          ? resolveTargetHost(input.source.request.url)
          : null;
      let methodForLog: string =
        input.source.type === "adhoc" ? input.source.request.method : "GET";
      let sourceType: "adhoc" | "collection_endpoint" =
        input.source.type === "adhoc" ? "adhoc" : "collection_endpoint";

      try {
        const sourcePersistence = resolveRunSourcePersistence(input);
        sourceType = sourcePersistence.sourceType;
        const sourceDraft = await buildSourceRequest(input);
        const variableContext = await buildVariableContext(input);
        const resolvedDraft = resolveVariables(
          sourceDraft,
          variableContext.values,
        );
        const authResolvedDraft = resolveAuth(resolvedDraft);
        const options = resolveRunOptions(input.options, config);

        targetHost = resolveTargetHost(authResolvedDraft.url);
        methodForLog = authResolvedDraft.method;

        assertRequestLimits(authResolvedDraft, config);
        assertNetworkPolicy(authResolvedDraft.url, config);

        const requestSnapshot = redactRequestSnapshot(
          authResolvedDraft,
          variableContext.values,
          variableContext.secretKeys,
          options,
          config,
        );

        const run = await runStore.createRunning({
          workspaceId: input.workspaceId,
          initiatedByUserId: input.initiatedByUserId,
          sourceType: sourcePersistence.sourceType,
          sourceCollectionId: sourcePersistence.sourceCollectionId,
          sourceEndpointId: sourcePersistence.sourceEndpointId,
          request: requestSnapshot,
          startedAt,
        });

        const rawResponse = await executeHttpRequest(
          authResolvedDraft,
          options,
        );
        const normalized = normalizeResponse(rawResponse, options);
        const redacted = redactResponseSnapshot(normalized, config);
        const completed = await runStore.completeSuccess(run.runId, redacted);

        logger.info("Runner execution completed", {
          runId: completed.runId,
          workspaceId: input.workspaceId,
          userId: input.initiatedByUserId,
          sourceType,
          targetHost,
          method: methodForLog,
          status: completed.response?.status ?? null,
          runStatus: completed.status,
          durationMs: completed.durationMs,
          policyDecision: "allow",
        });

        return completed;
      } catch (error) {
        const sourcePersistence = resolveRunSourcePersistence(input);
        sourceType = sourcePersistence.sourceType;
        const mappedError = toRunnerPublicError(error);

        const failedRun = await runStore.createRunning({
          workspaceId: input.workspaceId,
          initiatedByUserId: input.initiatedByUserId,
          sourceType: sourcePersistence.sourceType,
          sourceCollectionId: sourcePersistence.sourceCollectionId,
          sourceEndpointId: sourcePersistence.sourceEndpointId,
          request: {
            method:
              input.source.type === "adhoc"
                ? input.source.request.method
                : "GET",
            url: input.source.type === "adhoc" ? input.source.request.url : "",
            headers:
              input.source.type === "adhoc" ? input.source.request.headers : [],
            queryParams:
              input.source.type === "adhoc"
                ? input.source.request.queryParams
                : [],
            body:
              input.source.type === "adhoc" ? input.source.request.body : null,
            auth:
              input.source.type === "adhoc"
                ? input.source.request.auth
                : { type: "none" },
            resolvedVariables: {},
            timeoutMs: config.limits.timeoutMsDefault,
          },
          startedAt,
        });

        const completedFailure = await runStore.completeFailure(
          failedRun.runId,
          mappedError,
        );

        logger.warn("Runner execution failed", {
          runId: completedFailure.runId,
          workspaceId: input.workspaceId,
          userId: input.initiatedByUserId,
          sourceType,
          targetHost,
          method: methodForLog,
          runStatus: completedFailure.status,
          durationMs: completedFailure.durationMs,
          errorCode: mappedError.code,
          policyDecision:
            mappedError.code === "RUN_POLICY_BLOCKED" ? "deny" : "allow",
        });

        return completedFailure;
      }
    },

    async getRunById(
      workspaceId: number,
      runId: number,
    ): Promise<ExecuteRunResult | null> {
      const run = await runStore.findById(runId);

      if (!run || run.workspaceId !== workspaceId) {
        return null;
      }

      return run;
    },

    async cancelRun(
      workspaceId: number,
      runId: number,
    ): Promise<ExecuteRunResult | null> {
      const run = await runStore.findById(runId);

      if (!run || run.workspaceId !== workspaceId) {
        return null;
      }

      const cancelled = await runStore.cancel(runId);
      return cancelled ?? null;
    },
  };
};
