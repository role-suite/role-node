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
    const requestInit: RequestInit = {
      method: request.method,
      headers: toHeadersInit(request.headers),
      redirect: options.followRedirects ? "follow" : "manual",
      signal: controller.signal,
      ...(request.body?.raw !== undefined ? { body: request.body.raw } : {}),
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
