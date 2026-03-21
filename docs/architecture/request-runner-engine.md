# Request Runner Engine Design

This document defines a backend request runner engine for frontend clients with **minimal API exposure** and **internal-first implementation**.

## TL;DR

- Expose only a tiny public API: create run, get run, optional cancel.
- Keep all execution logic behind one internal facade: `runRequest(...)`.
- Enforce policy checks before outbound network calls.
- Resolve variables in a deterministic order.
- Redact secrets by default in responses and logs.

## Scope

### Goals

- Support both ad-hoc runs and saved collection endpoint runs.
- Persist run metadata and normalized request/response snapshots.
- Keep the external contract stable while allowing internal refactors.

### Non-goals (v1)

- No pre-request/test scripting runtime.
- No plugin architecture.
- No mandatory distributed queue dependency.

## Public API (minimal surface)

### Endpoints

- `POST /api/workspaces/:workspaceId/runs`
- `GET /api/workspaces/:workspaceId/runs/:runId`
- `POST /api/workspaces/:workspaceId/runs/:runId/cancel` (optional in sync mode, required in async mode)

### Create Run input shape

Union source type:

1. `adhoc` (full request payload)
2. `collectionEndpoint` (references existing collection/endpoint)

Example:

```json
{
  "source": {
    "type": "adhoc",
    "request": {
      "method": "GET",
      "url": "https://api.example.com/orders",
      "headers": [
        { "key": "Accept", "value": "application/json", "enabled": true }
      ],
      "queryParams": [{ "key": "limit", "value": "10", "enabled": true }],
      "body": null,
      "auth": { "type": "none" }
    }
  },
  "environmentId": 12,
  "variableOverrides": [{ "key": "region", "value": "eu-west-1" }],
  "options": { "timeoutMs": 10000, "followRedirects": true }
}
```

### Create Run output shape

```json
{
  "success": true,
  "data": {
    "runId": 501,
    "status": "completed",
    "startedAt": "2026-03-21T12:00:00.000Z",
    "completedAt": "2026-03-21T12:00:00.230Z",
    "durationMs": 230,
    "response": {
      "status": 200,
      "headers": { "content-type": "application/json" },
      "body": "{\"ok\":true}",
      "truncated": false,
      "sizeBytes": 11
    }
  }
}
```

## Internal Architecture (hidden by design)

### Public boundary module

- `src/modules/runs/runs.route.ts`
- `src/modules/runs/runs.controller.ts`
- `src/modules/runs/runs.service.ts`
- `src/modules/runs/runs.repo.ts`
- `src/modules/runs/runs.schema.ts`

### Internal engine

- `src/internal/runner/index.ts` (single facade export)
- `src/internal/runner/core/runner-engine.ts` (orchestrator)
- `src/internal/runner/core/types.ts`
- `src/internal/runner/planning/plan-builder.ts`
- `src/internal/runner/planning/variable-resolver.ts`
- `src/internal/runner/planning/auth-resolver.ts`
- `src/internal/runner/policy/network-policy.ts`
- `src/internal/runner/policy/limits-policy.ts`
- `src/internal/runner/policy/redaction-policy.ts`
- `src/internal/runner/execution/http-client.ts`
- `src/internal/runner/execution/response-normalizer.ts`
- `src/internal/runner/persistence/run-store.ts`
- `src/internal/runner/errors/runner-errors.ts`

### Isolation rule

`runs.service.ts` can import only `src/internal/runner/index.ts`.

## Engine facade contract

```ts
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
  status: "completed" | "failed" | "cancelled";
  startedAt: Date;
  completedAt: Date | null;
  durationMs: number | null;
  request: ExecutedRequestSnapshot;
  response: ExecutedResponseSnapshot | null;
  error: RunnerPublicError | null;
};

export const runRequest: (input: ExecuteRunInput) => Promise<ExecuteRunResult>;
```

## Execution pipeline

1. Validate input schema.
2. Authorize workspace membership and source access.
3. Build source request (ad-hoc payload or loaded endpoint).
4. Resolve variables with deterministic precedence.
5. Resolve auth fields.
6. Apply policies (network + limits).
7. Persist `running` state and request snapshot.
8. Execute outbound HTTP call.
9. Normalize response.
10. Redact sensitive values.
11. Persist final state (`completed` or `failed`).
12. Return projected API-safe result.

## Variable resolution

Pattern: `{{variableName}}`

Resolution targets:

- URL
- query parameter values
- header values
- auth fields (for example bearer token/basic password)
- raw text body

Precedence (highest first):

1. `variableOverrides`
2. environment variables where `enabled = true`
3. original literal value (fallback)

v1 behavior for unresolved variables: keep literal `{{missing}}` unchanged.

## Security defaults

### Network policy

- Allowed protocols: `http`, `https`
- Blocked by default: localhost and private ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `::1`, `fc00::/7`)
- DNS must be resolved and checked before connecting
- Optional allowlist for trusted internal domains

### Limits policy

- `timeoutMs`: default 10s, max 60s
- response body cap: default 1MB (`truncated = true` when clipped)
- request body size cap enforced

### Redaction policy

- `isSecret = true` values are masked in API response and logs
- redaction token: `***`
- secrets may exist in process memory only during execution

## Error model

Public error type:

```ts
type RunnerPublicError = {
  code:
    | "RUN_VALIDATION_FAILED"
    | "RUN_ACCESS_DENIED"
    | "RUN_SOURCE_NOT_FOUND"
    | "RUN_POLICY_BLOCKED"
    | "RUN_TIMEOUT"
    | "RUN_NETWORK_ERROR"
    | "RUN_RESPONSE_TOO_LARGE"
    | "RUN_INTERNAL_ERROR";
  message: string;
  details?: Record<string, unknown>;
};
```

Suggested HTTP mapping:

| Error class              | HTTP  |
| ------------------------ | ----- |
| Validation               | `400` |
| Access denied            | `403` |
| Source not found         | `404` |
| Policy blocked           | `422` |
| Timeout                  | `408` |
| Network upstream failure | `502` |
| Internal error           | `500` |

## Persistence model

### `request_runs`

- `id`
- `workspace_id` (FK `workspaces`)
- `initiated_by_user_id` (FK `auth_users`)
- `source_type` (`adhoc` | `collection_endpoint`)
- `source_collection_id` nullable
- `source_endpoint_id` nullable
- `status` (`queued` | `running` | `completed` | `failed` | `cancelled`)
- `started_at`, `completed_at`, `duration_ms`
- `error_code`, `error_message`, `error_json` nullable
- `created_at`

### `request_run_requests`

- `id`
- `run_id` (FK `request_runs`, unique)
- `method`, `url`
- `headers_json`, `query_params_json`
- `body_text` nullable
- `auth_json` nullable (must be redacted)
- `resolved_variables_json`
- `timeout_ms`
- `created_at`

### `request_run_responses`

- `id`
- `run_id` (FK `request_runs`, unique)
- `status_code`
- `headers_json`
- `body_text` nullable
- `body_base64` nullable (for binary responses)
- `size_bytes`
- `truncated` boolean
- `created_at`

### Recommended indexes

- `request_runs(workspace_id, created_at desc)`
- `request_runs(workspace_id, status, created_at desc)`

## Concurrency plan

### v1: synchronous

- Run executes in request lifecycle
- API returns final result directly

### v2: asynchronous worker

- API creates `queued` run
- Worker transitions `queued -> running -> completed|failed|cancelled`
- API returns status and final snapshots
- Cancel endpoint becomes active

## Observability

Structured run logs should include:

- `run_id`, `workspace_id`, `user_id`, `source_type`
- `target_host`, `method`, `status`, `duration_ms`
- policy deny/allow markers
- no plaintext secrets

Future metrics:

- run count by status
- latency p50/p95/p99
- timeout rate
- policy-block rate
- truncation rate

## Testing plan

Unit:

- variable interpolation + precedence
- policy matrix (allow/deny)
- redaction masking
- truncation behavior

Service:

- authz rules
- source loading behavior
- error mapping

Integration:

- `POST /runs` and `GET /runs/:runId`
- blocked-policy scenarios
- timeout scenarios

E2E:

- auth + workspace + environments + collections + runs full path

## Delivery milestones

### A. Core engine + sync runs

- internal runner scaffold
- run API endpoints
- ad-hoc and collection endpoint execution
- persistence for run/request/response

### B. Environment variable integration

- environment variable resolver
- per-run overrides
- redaction enforcement

### C. Security hardening

- SSRF and DNS guardrails
- limits and fail-fast behavior
- stable error taxonomy

### D. Async mode

- queue + worker
- status transitions
- cancel endpoint

## Open decisions

- Should unresolved variables fail or pass through by default?
- Should workspace `member` role be allowed to execute runs?
- What is the default response size cap for v1?
- Should binary bodies be persisted, and with what retention?
- What retention policy should apply to `request_runs`?

## Summary

The design keeps API exposure intentionally small while putting all operational complexity inside an internal runner engine. This supports secure execution, stable frontend contracts, and future scalability without leaking internal mechanics.
