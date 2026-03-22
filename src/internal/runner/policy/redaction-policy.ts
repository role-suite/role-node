import type { RequestRunnerEngineConfig } from "../config/engine-config.js";
import type {
  ExecutedRequestSnapshot,
  ExecutedResponseSnapshot,
  HttpRequestDraft,
  HttpRequestAuth,
  HttpRequestBody,
  HttpKeyValue,
  ResolvedRunOptions,
} from "../core/types.js";

const isHeaderSensitive = (
  key: string,
  config: RequestRunnerEngineConfig,
): boolean => {
  const normalized = key.toLowerCase();
  return config.redaction.secretHeaderKeys.some(
    (candidate) => candidate.toLowerCase() === normalized,
  );
};

const isQuerySensitive = (
  key: string,
  config: RequestRunnerEngineConfig,
): boolean => {
  const normalized = key.toLowerCase();
  return config.redaction.secretQueryKeyPatterns.some((pattern) =>
    normalized.includes(pattern.toLowerCase()),
  );
};

const redactAuth = (
  auth: HttpRequestAuth,
  config: RequestRunnerEngineConfig,
): HttpRequestAuth => {
  if (auth.type === "none") {
    return auth;
  }

  if (auth.type === "bearer") {
    return {
      type: "bearer",
      token: config.redaction.token,
    };
  }

  return {
    type: "basic",
    username: auth.username,
    password: config.redaction.token,
  };
};

const redactBody = (
  body: HttpRequestBody,
  _config: RequestRunnerEngineConfig,
): HttpRequestBody => {
  if (!body) {
    return null;
  }

  if (body.mode === "formdata") {
    return {
      mode: "formdata",
      entries: body.entries.map((entry) => ({ ...entry })),
    };
  }

  if (body.mode === "urlencoded") {
    return {
      mode: "urlencoded",
      entries: body.entries.map((entry) => ({ ...entry })),
    };
  }

  return { ...body };
};

const redactUrlQueryValues = (
  url: string,
  config: RequestRunnerEngineConfig,
): string => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  for (const [key] of parsed.searchParams.entries()) {
    if (isQuerySensitive(key, config)) {
      parsed.searchParams.set(key, config.redaction.token);
    }
  }

  return parsed.toString();
};

const redactHeaders = (
  headers: HttpKeyValue[],
  config: RequestRunnerEngineConfig,
): HttpKeyValue[] => {
  return headers.map((header) => {
    if (!isHeaderSensitive(header.key, config)) {
      return { ...header };
    }

    return {
      ...header,
      value: config.redaction.token,
    };
  });
};

const redactQueryParams = (
  queryParams: HttpKeyValue[],
  config: RequestRunnerEngineConfig,
): HttpKeyValue[] => {
  return queryParams.map((queryParam) => {
    if (!isQuerySensitive(queryParam.key, config)) {
      return { ...queryParam };
    }

    return {
      ...queryParam,
      value: config.redaction.token,
    };
  });
};

export const redactRequestSnapshot = (
  request: HttpRequestDraft,
  resolvedVariables: Record<string, string>,
  secretVariableKeys: Set<string>,
  options: ResolvedRunOptions,
  config: RequestRunnerEngineConfig,
): ExecutedRequestSnapshot => {
  return {
    method: request.method,
    url: redactUrlQueryValues(request.url, config),
    headers: redactHeaders(request.headers, config),
    queryParams: redactQueryParams(request.queryParams, config),
    body: redactBody(request.body, config),
    auth: redactAuth(request.auth, config),
    resolvedVariables: Object.fromEntries(
      Object.entries(resolvedVariables).map(([key, value]) => {
        return [
          key,
          isQuerySensitive(key, config) || secretVariableKeys.has(key)
            ? config.redaction.token
            : value,
        ];
      }),
    ),
    timeoutMs: options.timeoutMs,
  };
};

export const redactResponseSnapshot = (
  response: ExecutedResponseSnapshot,
  config: RequestRunnerEngineConfig,
): ExecutedResponseSnapshot => {
  const headers = Object.fromEntries(
    Object.entries(response.headers).map(([key, value]) => {
      return [
        key,
        isHeaderSensitive(key, config) ? config.redaction.token : value,
      ];
    }),
  );

  return {
    ...response,
    headers,
  };
};
