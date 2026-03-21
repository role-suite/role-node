import { Buffer } from "node:buffer";

import type { HttpRequestDraft } from "../core/types.js";

const hasAuthorizationHeader = (
  headers: HttpRequestDraft["headers"],
): boolean => {
  return headers.some(
    (header) =>
      (header.enabled ?? true) && header.key.toLowerCase() === "authorization",
  );
};

export const resolveAuth = (request: HttpRequestDraft): HttpRequestDraft => {
  if (request.auth.type === "none") {
    return request;
  }

  if (hasAuthorizationHeader(request.headers)) {
    return request;
  }

  if (request.auth.type === "bearer") {
    return {
      ...request,
      headers: [
        ...request.headers,
        {
          key: "Authorization",
          value: `Bearer ${request.auth.token}`,
          enabled: true,
        },
      ],
    };
  }

  const basic = Buffer.from(
    `${request.auth.username}:${request.auth.password}`,
    "utf8",
  ).toString("base64");

  return {
    ...request,
    headers: [
      ...request.headers,
      {
        key: "Authorization",
        value: `Basic ${basic}`,
        enabled: true,
      },
    ],
  };
};
