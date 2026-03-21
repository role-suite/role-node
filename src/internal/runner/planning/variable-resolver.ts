import type { HttpRequestDraft } from "../core/types.js";

const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/gu;

const resolveString = (
  value: string,
  context: Record<string, string>,
): string => {
  return value.replace(VARIABLE_PATTERN, (match, key: string) => {
    const resolved = context[key];
    return resolved === undefined ? match : resolved;
  });
};

export const resolveVariables = (
  request: HttpRequestDraft,
  context: Record<string, string>,
): HttpRequestDraft => {
  return {
    method: request.method,
    url: resolveString(request.url, context),
    headers: request.headers.map((header) => ({
      ...header,
      value: resolveString(header.value, context),
    })),
    queryParams: request.queryParams.map((query) => ({
      ...query,
      value: resolveString(query.value, context),
    })),
    body: request.body
      ? {
          ...request.body,
          ...(request.body.raw
            ? { raw: resolveString(request.body.raw, context) }
            : {}),
        }
      : null,
    auth:
      request.auth.type === "bearer"
        ? {
            type: "bearer",
            token: resolveString(request.auth.token, context),
          }
        : request.auth.type === "basic"
          ? {
              type: "basic",
              username: resolveString(request.auth.username, context),
              password: resolveString(request.auth.password, context),
            }
          : { type: "none" },
  };
};
