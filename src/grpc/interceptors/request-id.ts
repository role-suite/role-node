import { randomUUID } from "node:crypto";

import { Metadata } from "@grpc/grpc-js";

export const GRPC_REQUEST_ID_HEADER = "x-request-id";

const readFirstMetadataValue = (
  metadata: Metadata,
  key: string,
): string | undefined => {
  const value = metadata.get(key)[0];

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

export const resolveRequestId = (metadata: Metadata): string => {
  return (
    readFirstMetadataValue(metadata, GRPC_REQUEST_ID_HEADER) ?? randomUUID()
  );
};

export const createRequestMetadata = (requestId: string): Metadata => {
  const metadata = new Metadata();
  metadata.set(GRPC_REQUEST_ID_HEADER, requestId);
  return metadata;
};
