import { Buffer } from "node:buffer";

import type {
  ExecuteRunInput,
  HttpRequestDraft,
  ResolvedRunOptions,
} from "../core/types.js";
import type { RequestRunnerEngineConfig } from "../config/engine-config.js";
import { RunnerError } from "../errors/runner-errors.js";

const encoder = new TextEncoder();

const base64Size = (value: string): number => {
  try {
    return Buffer.from(value, "base64").byteLength;
  } catch {
    return encoder.encode(value).byteLength;
  }
};

const bodySize = (request: HttpRequestDraft): number => {
  if (!request.body || request.body.mode === "none") {
    return 0;
  }

  if (request.body.mode === "raw") {
    return encoder.encode(request.body.raw).byteLength;
  }

  if (request.body.mode === "urlencoded") {
    return request.body.entries.reduce((total, entry) => {
      return total + encoder.encode(`${entry.key}=${entry.value}`).byteLength;
    }, 0);
  }

  if (request.body.mode === "formdata") {
    return request.body.entries.reduce((total, entry) => {
      if (entry.type === "text") {
        return total + encoder.encode(`${entry.key}=${entry.value}`).byteLength;
      }

      return total + base64Size(entry.dataBase64);
    }, 0);
  }

  return base64Size(request.body.dataBase64);
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
