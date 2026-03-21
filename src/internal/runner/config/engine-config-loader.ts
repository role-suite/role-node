import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  requestRunnerEngineConfigSchema,
  requestRunnerEngineDefaults,
  type RequestRunnerEngineConfig,
} from "./engine-config.js";

type JsonObject = Record<string, unknown>;

const isPlainObject = (value: unknown): value is JsonObject => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const deepMerge = <T extends JsonObject>(base: T, next: JsonObject): T => {
  const merged: JsonObject = { ...base };

  for (const [key, nextValue] of Object.entries(next)) {
    const baseValue = merged[key];

    if (isPlainObject(baseValue) && isPlainObject(nextValue)) {
      merged[key] = deepMerge(baseValue, nextValue);
      continue;
    }

    merged[key] = nextValue;
  }

  return merged as T;
};

const parseJsonFile = (filePath: string): JsonObject => {
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;

  if (!isPlainObject(parsed)) {
    throw new Error(`Runner config must be a JSON object: ${filePath}`);
  }

  return parsed;
};

const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`Invalid boolean env override value: ${value}`);
};

const parseNumber = (value: string | undefined): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric env override value: ${value}`);
  }

  return parsed;
};

const parseCsv = (value: string | undefined): string[] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

export const resolveRunnerConfigPaths = (): {
  baseConfigPath: string;
  localConfigPath: string;
} => {
  return {
    baseConfigPath: path.resolve(
      process.cwd(),
      "config/request-runner.config.json",
    ),
    localConfigPath: path.resolve(
      process.cwd(),
      "config/request-runner.config.local.json",
    ),
  };
};

export const applyEngineConfigEnvOverrides = (
  config: RequestRunnerEngineConfig,
): RequestRunnerEngineConfig => {
  const envOverride: JsonObject = {
    ...(process.env.RUNNER_MODE ? { mode: process.env.RUNNER_MODE } : {}),
    execution: {
      ...(parseBoolean(process.env.RUNNER_FOLLOW_REDIRECTS_DEFAULT) !==
      undefined
        ? {
            followRedirectsDefault: parseBoolean(
              process.env.RUNNER_FOLLOW_REDIRECTS_DEFAULT,
            ),
          }
        : {}),
      ...(parseNumber(process.env.RUNNER_MAX_REDIRECTS) !== undefined
        ? { maxRedirects: parseNumber(process.env.RUNNER_MAX_REDIRECTS) }
        : {}),
    },
    limits: {
      ...(parseNumber(process.env.RUNNER_TIMEOUT_MS_DEFAULT) !== undefined
        ? {
            timeoutMsDefault: parseNumber(
              process.env.RUNNER_TIMEOUT_MS_DEFAULT,
            ),
          }
        : {}),
      ...(parseNumber(process.env.RUNNER_TIMEOUT_MS_MAX) !== undefined
        ? { timeoutMsMax: parseNumber(process.env.RUNNER_TIMEOUT_MS_MAX) }
        : {}),
      ...(parseNumber(process.env.RUNNER_MAX_REQUEST_BYTES) !== undefined
        ? { maxRequestBytes: parseNumber(process.env.RUNNER_MAX_REQUEST_BYTES) }
        : {}),
      ...(parseNumber(process.env.RUNNER_MAX_RESPONSE_BYTES_DEFAULT) !==
      undefined
        ? {
            maxResponseBytesDefault: parseNumber(
              process.env.RUNNER_MAX_RESPONSE_BYTES_DEFAULT,
            ),
          }
        : {}),
    },
    policy: {
      ...(parseBoolean(process.env.RUNNER_ALLOW_HTTP) !== undefined
        ? { allowHttp: parseBoolean(process.env.RUNNER_ALLOW_HTTP) }
        : {}),
      ...(parseBoolean(process.env.RUNNER_ALLOW_HTTPS) !== undefined
        ? { allowHttps: parseBoolean(process.env.RUNNER_ALLOW_HTTPS) }
        : {}),
      ...(parseBoolean(process.env.RUNNER_BLOCK_LOCALHOST) !== undefined
        ? { blockLocalhost: parseBoolean(process.env.RUNNER_BLOCK_LOCALHOST) }
        : {}),
      ...(parseCsv(process.env.RUNNER_DOMAIN_ALLOWLIST) !== undefined
        ? { domainAllowlist: parseCsv(process.env.RUNNER_DOMAIN_ALLOWLIST) }
        : {}),
    },
    persistence: {
      ...(parseNumber(process.env.RUNNER_RETENTION_DAYS) !== undefined
        ? { retentionDays: parseNumber(process.env.RUNNER_RETENTION_DAYS) }
        : {}),
      ...(parseBoolean(process.env.RUNNER_PERSIST_BINARY_BODIES) !== undefined
        ? {
            persistBinaryBodies: parseBoolean(
              process.env.RUNNER_PERSIST_BINARY_BODIES,
            ),
          }
        : {}),
    },
  };

  const withOverrides = deepMerge(config as JsonObject, envOverride);
  return requestRunnerEngineConfigSchema.parse(withOverrides);
};

export const loadRequestRunnerEngineConfig = (): RequestRunnerEngineConfig => {
  const { baseConfigPath, localConfigPath } = resolveRunnerConfigPaths();

  if (!existsSync(baseConfigPath)) {
    throw new Error(
      `Missing runner config file: ${baseConfigPath}. Create it from defaults.`,
    );
  }

  const baseConfig = parseJsonFile(baseConfigPath);
  const localConfig = existsSync(localConfigPath)
    ? parseJsonFile(localConfigPath)
    : {};

  const merged = deepMerge(
    requestRunnerEngineDefaults as unknown as JsonObject,
    deepMerge(baseConfig, localConfig),
  );

  const parsed = requestRunnerEngineConfigSchema.parse(merged);
  return applyEngineConfigEnvOverrides(parsed);
};
