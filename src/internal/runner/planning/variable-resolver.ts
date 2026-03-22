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
  const body = (() => {
    if (!request.body) {
      return null;
    }

    if (request.body.mode === "raw") {
      return {
        ...request.body,
        raw: resolveString(request.body.raw, context),
      };
    }

    if (request.body.mode === "urlencoded") {
      return {
        mode: "urlencoded" as const,
        entries: request.body.entries.map((entry) => ({
          ...entry,
          value: resolveString(entry.value, context),
        })),
      };
    }

    if (request.body.mode === "formdata") {
      return {
        mode: "formdata" as const,
        entries: request.body.entries.map((entry) => {
          if (entry.type === "text") {
            return {
              ...entry,
              value: resolveString(entry.value, context),
            };
          }

          return {
            ...entry,
            fileName: resolveString(entry.fileName, context),
          };
        }),
      };
    }

    if (request.body.mode === "binary") {
      return {
        ...request.body,
        fileName: resolveString(request.body.fileName, context),
      };
    }

    return {
      mode: "none" as const,
    };
  })();

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
    body,
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
