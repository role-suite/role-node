export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type HttpKeyValue = {
  key: string;
  value: string;
  enabled?: boolean;
};

export type HttpRequestBody = {
  contentType?: string;
  raw?: string;
} | null;

export type HttpRequestAuth =
  | { type: "none" }
  | { type: "bearer"; token: string }
  | { type: "basic"; username: string; password: string };

export type HttpRequestDraft = {
  method: HttpMethod;
  url: string;
  headers: HttpKeyValue[];
  queryParams: HttpKeyValue[];
  body: HttpRequestBody;
  auth: HttpRequestAuth;
};

export type RunnerPublicErrorCode =
  | "RUN_VALIDATION_FAILED"
  | "RUN_ACCESS_DENIED"
  | "RUN_SOURCE_NOT_FOUND"
  | "RUN_POLICY_BLOCKED"
  | "RUN_TIMEOUT"
  | "RUN_NETWORK_ERROR"
  | "RUN_RESPONSE_TOO_LARGE"
  | "RUN_CANCELLED"
  | "RUN_INTERNAL_ERROR";

export type RunnerPublicError = {
  code: RunnerPublicErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

export type ExecutedRequestSnapshot = {
  method: HttpMethod;
  url: string;
  headers: HttpKeyValue[];
  queryParams: HttpKeyValue[];
  body: HttpRequestBody;
  auth: HttpRequestAuth;
  resolvedVariables: Record<string, string>;
  timeoutMs: number;
};

export type ExecutedResponseSnapshot = {
  status: number;
  headers: Record<string, string>;
  body: string | null;
  bodyBase64: string | null;
  truncated: boolean;
  sizeBytes: number;
};

export type ExecuteRunInput = {
  workspaceId: number;
  initiatedByUserId: number;
  source:
    | { type: "adhoc"; request: HttpRequestDraft }
    | { type: "collectionEndpoint"; collectionId: number; endpointId: number };
  environmentId?: number;
  variableOverrides?: Array<{ key: string; value: string }>;
  options?: {
    timeoutMs?: number;
    followRedirects?: boolean;
    maxResponseBytes?: number;
  };
};

export type ExecuteRunResult = {
  runId: number;
  status: "running" | "completed" | "failed" | "cancelled";
  startedAt: Date;
  completedAt: Date | null;
  durationMs: number | null;
  request: ExecutedRequestSnapshot;
  response: ExecutedResponseSnapshot | null;
  error: RunnerPublicError | null;
};

export type ResolvedRunOptions = {
  timeoutMs: number;
  followRedirects: boolean;
  maxResponseBytes: number;
  maxRedirects: number;
};

export type VariableContext = {
  values: Record<string, string>;
  secretKeys: Set<string>;
};

export type RunSourcePersistence = {
  sourceType: "adhoc" | "collection_endpoint";
  sourceCollectionId: number | null;
  sourceEndpointId: number | null;
};

export type StoredRun = ExecuteRunResult & {
  workspaceId: number;
  initiatedByUserId: number;
};

export type HttpExecutionResponse = {
  status: number;
  headers: Record<string, string>;
  bodyBytes: Uint8Array;
};
