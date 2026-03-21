import { Buffer } from "node:buffer";

import type {
  ExecutedResponseSnapshot,
  HttpExecutionResponse,
  ResolvedRunOptions,
} from "../core/types.js";

const isTextLikeContentType = (contentType: string | undefined): boolean => {
  if (!contentType) {
    return false;
  }

  const normalized = contentType.toLowerCase();
  return (
    normalized.startsWith("text/") ||
    normalized.includes("json") ||
    normalized.includes("xml") ||
    normalized.includes("javascript") ||
    normalized.includes("x-www-form-urlencoded")
  );
};

export const normalizeResponse = (
  response: HttpExecutionResponse,
  options: ResolvedRunOptions,
): ExecutedResponseSnapshot => {
  const sizeBytes = response.bodyBytes.byteLength;
  const clippedBytes =
    sizeBytes > options.maxResponseBytes
      ? response.bodyBytes.slice(0, options.maxResponseBytes)
      : response.bodyBytes;
  const truncated = sizeBytes > options.maxResponseBytes;

  const contentType = response.headers["content-type"];
  const isText = isTextLikeContentType(contentType);

  if (isText) {
    return {
      status: response.status,
      headers: response.headers,
      body: Buffer.from(clippedBytes).toString("utf8"),
      bodyBase64: null,
      truncated,
      sizeBytes,
    };
  }

  return {
    status: response.status,
    headers: response.headers,
    body: null,
    bodyBase64: Buffer.from(clippedBytes).toString("base64"),
    truncated,
    sizeBytes,
  };
};
