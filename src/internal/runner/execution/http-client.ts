import { Buffer } from "node:buffer";

import type {
  HttpExecutionResponse,
  HttpKeyValue,
  HttpRequestDraft,
  ResolvedRunOptions,
} from "../core/types.js";

const toHeadersInit = (headers: HttpKeyValue[]): HeadersInit => {
  return headers
    .filter((header) => header.enabled ?? true)
    .reduce<Record<string, string>>((acc, header) => {
      acc[header.key] = header.value;
      return acc;
    }, {});
};

const hasHeader = (headers: HttpKeyValue[], key: string): boolean => {
  const normalized = key.toLowerCase();
  return headers.some(
    (header) =>
      (header.enabled ?? true) && header.key.toLowerCase() === normalized,
  );
};

const resolveRequestBody = (
  request: HttpRequestDraft,
): {
  body?: BodyInit;
  headers: HttpKeyValue[];
} => {
  if (!request.body || request.body.mode === "none") {
    return {
      headers: request.headers,
    };
  }

  if (request.body.mode === "raw") {
    const contentType = request.body.contentType;
    const shouldSetContentType =
      !!contentType && !hasHeader(request.headers, "content-type");

    return {
      body: request.body.raw,
      headers: shouldSetContentType
        ? [
            ...request.headers,
            {
              key: "Content-Type",
              value: contentType,
              enabled: true,
            },
          ]
        : request.headers,
    };
  }

  if (request.body.mode === "urlencoded") {
    const params = new URLSearchParams();

    for (const entry of request.body.entries) {
      if (!(entry.enabled ?? true)) {
        continue;
      }

      params.append(entry.key, entry.value);
    }

    return {
      body: params.toString(),
      headers: hasHeader(request.headers, "content-type")
        ? request.headers
        : [
            ...request.headers,
            {
              key: "Content-Type",
              value: "application/x-www-form-urlencoded",
              enabled: true,
            },
          ],
    };
  }

  if (request.body.mode === "formdata") {
    const formData = new FormData();

    for (const entry of request.body.entries) {
      if (!(entry.enabled ?? true)) {
        continue;
      }

      if (entry.type === "text") {
        formData.append(entry.key, entry.value);
        continue;
      }

      const buffer = Buffer.from(entry.dataBase64, "base64");
      formData.append(
        entry.key,
        new Blob([buffer], {
          type: entry.contentType ?? "application/octet-stream",
        }),
        entry.fileName,
      );
    }

    return {
      body: formData,
      headers: request.headers.filter(
        (header) => header.key.toLowerCase() !== "content-type",
      ),
    };
  }

  return {
    body: Buffer.from(request.body.dataBase64, "base64"),
    headers: hasHeader(request.headers, "content-type")
      ? request.headers
      : [
          ...request.headers,
          {
            key: "Content-Type",
            value: request.body.contentType ?? "application/octet-stream",
            enabled: true,
          },
        ],
  };
};

const appendQueryParams = (
  url: string,
  queryParams: HttpKeyValue[],
): string => {
  const parsed = new URL(url);

  for (const queryParam of queryParams) {
    if (!(queryParam.enabled ?? true)) {
      continue;
    }

    parsed.searchParams.set(queryParam.key, queryParam.value);
  }

  return parsed.toString();
};

export const executeHttpRequest = async (
  request: HttpRequestDraft,
  options: ResolvedRunOptions,
): Promise<HttpExecutionResponse> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, options.timeoutMs);

  try {
    const finalUrl = appendQueryParams(request.url, request.queryParams);
    const resolved = resolveRequestBody(request);
    const requestInit: RequestInit = {
      method: request.method,
      headers: toHeadersInit(resolved.headers),
      redirect: options.followRedirects ? "follow" : "manual",
      signal: controller.signal,
      ...(resolved.body !== undefined ? { body: resolved.body } : {}),
    };
    const response = await fetch(finalUrl, {
      ...requestInit,
    });

    const responseBody = new Uint8Array(await response.arrayBuffer());

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      bodyBytes: responseBody,
    };
  } finally {
    clearTimeout(timeout);
  }
};
