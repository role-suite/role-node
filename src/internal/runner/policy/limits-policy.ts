import type {
  ExecuteRunInput,
  HttpRequestDraft,
  ResolvedRunOptions,
} from "../core/types.js";
import type { RequestRunnerEngineConfig } from "../config/engine-config.js";
import { RunnerError } from "../errors/runner-errors.js";

const encoder = new TextEncoder();

const bodySize = (request: HttpRequestDraft): number => {
  if (!request.body?.raw) {
    return 0;
  }

  return encoder.encode(request.body.raw).byteLength;
};

export const resolveRunOptions = (
  inputOptions: ExecuteRunInput["options"] | undefined,
  config: RequestRunnerEngineConfig,
): ResolvedRunOptions => {
  const timeoutMs = inputOptions?.timeoutMs ?? config.limits.timeoutMsDefault;
  const followRedirects =
    inputOptions?.followRedirects ?? config.execution.followRedirectsDefault;
  const maxResponseBytes =
    inputOptions?.maxResponseBytes ?? config.limits.maxResponseBytesDefault;

  if (timeoutMs > config.limits.timeoutMsMax) {
    throw new RunnerError(
      "RUN_VALIDATION_FAILED",
      "timeoutMs exceeds configured maximum",
      {
        timeoutMs,
        timeoutMsMax: config.limits.timeoutMsMax,
      },
    );
  }

  if (timeoutMs <= 0 || maxResponseBytes <= 0) {
    throw new RunnerError("RUN_VALIDATION_FAILED", "Invalid run option values");
  }

  return {
    timeoutMs,
    followRedirects,
    maxResponseBytes,
    maxRedirects: config.execution.maxRedirects,
  };
};

export const assertRequestLimits = (
  request: HttpRequestDraft,
  config: RequestRunnerEngineConfig,
): void => {
  const requestBytes = bodySize(request);

  if (requestBytes > config.limits.maxRequestBytes) {
    throw new RunnerError(
      "RUN_VALIDATION_FAILED",
      "Request body exceeds configured maximum",
      {
        requestBytes,
        maxRequestBytes: config.limits.maxRequestBytes,
      },
    );
  }
};
