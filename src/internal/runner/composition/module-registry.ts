import type { RequestRunnerEngineConfig } from "../config/engine-config.js";
import type { HttpRequestDraft, ResolvedRunOptions } from "../core/types.js";
import {
  executeHttpRequest,
  type FetchLike,
} from "../execution/http-client.js";
import { assertNetworkPolicy } from "../policy/network-policy.js";
import {
  assertRequestLimits,
  resolveRunOptions,
} from "../policy/limits-policy.js";
import {
  redactRequestSnapshot,
  redactResponseSnapshot,
} from "../policy/redaction-policy.js";
import { createDbRunStore } from "../persistence/run-store.js";

type RunStoreFactory = (
  config: RequestRunnerEngineConfig,
) => ReturnType<typeof createDbRunStore>;

type HttpExecutor = (
  request: HttpRequestDraft,
  options: ResolvedRunOptions,
  validateRedirectTarget?: (url: string) => void,
) => Promise<{
  status: number;
  headers: Record<string, string>;
  bodyBytes: Uint8Array;
}>;

const resolveGlobalFetch = (): FetchLike => {
  if (typeof globalThis.fetch !== "function") {
    throw new Error("Global fetch is not available in this runtime");
  }

  return globalThis.fetch.bind(globalThis);
};

const createNodeFetchExecutor = (): HttpExecutor => {
  let cachedFetch: FetchLike | null = null;

  return async (request, options, validateRedirectTarget) => {
    if (!cachedFetch) {
      try {
        const imported = (await import("node-fetch" as string)) as {
          default?: unknown;
        };

        if (typeof imported.default === "function") {
          cachedFetch = imported.default as FetchLike;
        } else {
          cachedFetch = resolveGlobalFetch();
        }
      } catch {
        cachedFetch = resolveGlobalFetch();
      }
    }

    return executeHttpRequest(
      request,
      options,
      cachedFetch,
      validateRedirectTarget,
    );
  };
};

export const moduleRegistry = {
  runStore: {
    postgres: ((config: RequestRunnerEngineConfig) => {
      return createDbRunStore({
        retentionDays: config.persistence.retentionDays,
        persistBinaryBodies: config.persistence.persistBinaryBodies,
      });
    }) as RunStoreFactory,
  },
  httpExecutor: {
    undici: (
      request: HttpRequestDraft,
      options: ResolvedRunOptions,
      validateRedirectTarget?: (url: string) => void,
    ) => {
      return executeHttpRequest(
        request,
        options,
        resolveGlobalFetch(),
        validateRedirectTarget,
      );
    },
    "node-fetch": createNodeFetchExecutor(),
  },
  networkPolicy: {
    default: assertNetworkPolicy,
  },
  limitsPolicy: {
    default: {
      resolveRunOptions,
      assertRequestLimits,
    },
  },
  redactionPolicy: {
    default: {
      redactRequestSnapshot,
      redactResponseSnapshot,
    },
  },
} as const;
