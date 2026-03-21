# Request Runner Engine Design

This document defines a backend request runner engine for frontend clients with **minimal API exposure** and **internal-first implementation**.

## TL;DR

- Expose only a tiny public API: create run, get run, optional cancel.
- Keep execution logic behind one internal facade: `runRequest(...)`.
- Drive behavior from a typed engine config file, not hardcoded defaults.
- Enforce authz and policy checks before outbound network calls.
- Resolve variables in deterministic order and redact secrets by default.
- Persist normalized request/response snapshots for auditing and debugging.

## Scope

### Goals

- Support ad-hoc runs and saved collection endpoint runs.
- Persist run metadata plus normalized request/response snapshots.
- Keep external contracts stable while allowing internal refactors.
- Start synchronous in v1, with an async worker migration path in v2.
- Keep the engine modular so policies/executors/stores can be swapped by config.

### Non-goals (v1)

- No pre-request/test scripting runtime.
- No plugin architecture.
- No mandatory distributed queue dependency.
- No automatic retries for non-idempotent requests.

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

### API behavior guarantees

- `runId` is globally unique and immutable.
- `GET /runs/:runId` is strongly consistent in sync mode.
- `GET /runs/:runId` may be eventually consistent in async mode (worker lag).
- For canceled runs, `status = cancelled`, `response = null`, and `error` is cancellation-specific.

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

### Engine configuration and composition

- `src/internal/runner/config/engine-config.ts` (typed schema + defaults)
- `src/internal/runner/config/engine-config-loader.ts` (file/env loader)
- `src/internal/runner/composition/module-registry.ts` (module key -> implementation)
- `src/internal/runner/composition/build-engine.ts` (wires modules once at boot)

Suggested config file location:

- `config/request-runner.config.json` (deployment-specific)
- optional `config/request-runner.config.local.json` (developer overrides, gitignored)

### Isolation rule

`runs.service.ts` can import only `src/internal/runner/index.ts` from the internal runner package.

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

## Configuration-driven modular engine

### Config contract (v1)

```ts
type RequestRunnerEngineConfig = {
  mode: "sync" | "async";
  execution: {
    httpClient: "undici" | "node-fetch";
    followRedirectsDefault: boolean;
    maxRedirects: number;
  };
  limits: {
    timeoutMsDefault: number;
    timeoutMsMax: number;
    maxRequestBytes: number;
    maxResponseBytesDefault: number;
  };
  policy: {
    allowHttp: boolean;
    allowHttps: boolean;
    blockLocalhost: boolean;
    blockPrivateCidrs: string[];
    domainAllowlist: string[];
  };
  redaction: {
    token: string;
    secretHeaderKeys: string[];
    secretQueryKeyPatterns: string[];
  };
  persistence: {
    retentionDays: number;
    persistBinaryBodies: boolean;
  };
  modules: {
    runStore: "postgres";
    networkPolicy: "default";
    limitsPolicy: "default";
    redactionPolicy: "default";
  };
};
```

### Boot sequence

1. Load config from file, then apply env overrides.
2. Validate config against typed schema.
3. Resolve module implementations via registry keys.
4. Build single engine instance and inject into `runs.service.ts`.
5. Fail fast on invalid config or unknown module keys.

### Modularity rules

- `runner-engine.ts` depends only on interfaces, never concrete implementations.
- Concrete modules are selected in `build-engine.ts` from config keys.
- Modules are stateless where possible; shared resources are singleton-scoped.
- New modules are additive: implement interface, register key, update config schema.

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

### Pseudocode (orchestrator)

```ts
export async function runRequest(
  input: ExecuteRunInput,
): Promise<ExecuteRunResult> {
  const now = new Date();
  const validated = validateExecuteRunInput(input);
  await authorizeOrThrow(
    validated.workspaceId,
    validated.initiatedByUserId,
    validated.source,
  );

  const sourceDraft = await buildSourceRequest(validated);
  const variableContext = await buildVariableContext(validated);
  const resolvedDraft = resolveVariables(sourceDraft, variableContext);
  const authResolvedDraft = resolveAuth(resolvedDraft, variableContext);

  applyLimitsPolicyOrThrow(authResolvedDraft, validated.options);
  await applyNetworkPolicyOrThrow(authResolvedDraft.url);

  const run = await runStore.createRunning({
    input: validated,
    requestSnapshot: redactRequest(authResolvedDraft),
    startedAt: now,
  });

  try {
    const rawResponse = await httpClient.execute(
      authResolvedDraft,
      validated.options,
    );
    const normalized = normalizeResponse(rawResponse, validated.options);
    const redacted = redactResponse(normalized);
    return await runStore.completeSuccess(run.id, redacted);
  } catch (err) {
    const mapped = mapToRunnerPublicError(err);
    return await runStore.completeFailure(run.id, mapped);
  }
}
```

### Pseudocode (boot-time composition)

```ts
const rawConfig = loadEngineConfigFile("config/request-runner.config.json");
const config = validateEngineConfig(applyEnvOverrides(rawConfig));

const modules = {
  runStore: moduleRegistry.runStore[config.modules.runStore],
  networkPolicy: moduleRegistry.networkPolicy[config.modules.networkPolicy],
  limitsPolicy: moduleRegistry.limitsPolicy[config.modules.limitsPolicy],
  redactionPolicy:
    moduleRegistry.redactionPolicy[config.modules.redactionPolicy],
};

export const requestRunnerEngine = buildEngine({ config, modules });
```

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

### Determinism rules

- Variable lookup is case-sensitive.
- Last-write-wins inside each source list (`variableOverrides`, environment variables).
- Resolver is pure: no network IO, no randomness, no time-based values.

## Security defaults

### Network policy

- Allowed protocols: `http`, `https`.
- Blocked by default: localhost and private ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `::1`, `fc00::/7`).
- DNS must be resolved and checked before connecting.
- Follow-up DNS revalidation recommended on redirect hops.
- Optional allowlist for trusted internal domains.

### Limits policy

- `timeoutMs`: default and max are read from config.
- response body cap default is read from config (`truncated = true` when clipped).
- request body size cap enforced before dispatch.
- max redirect hops is read from config when `followRedirects = true`.

### Redaction policy

- `isSecret = true` values are masked in API response and logs.
- header keys matching `authorization`, `proxy-authorization`, `x-api-key`, `cookie`, `set-cookie` are masked.
- query keys containing `token`, `secret`, `key`, `password` are masked.
- redaction token: `***`.
- secrets may exist in process memory only during execution.

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
    | "RUN_CANCELLED"
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
| Cancelled                | `409` |
| Internal error           | `500` |

## Persistence model

### `request_runs`

- `id` bigint primary key
- `workspace_id` bigint not null (FK `workspaces`)
- `initiated_by_user_id` bigint not null (FK `auth_users`)
- `source_type` text not null (`adhoc` | `collection_endpoint`)
- `source_collection_id` bigint null
- `source_endpoint_id` bigint null
- `status` text not null (`queued` | `running` | `completed` | `failed` | `cancelled`)
- `started_at` timestamptz null
- `completed_at` timestamptz null
- `duration_ms` integer null
- `error_code` text null
- `error_message` text null
- `error_json` jsonb null
- `created_at` timestamptz not null default now()

### `request_run_requests`

- `id` bigint primary key
- `run_id` bigint not null unique (FK `request_runs`)
- `method` text not null
- `url` text not null
- `headers_json` jsonb not null
- `query_params_json` jsonb not null
- `body_text` text null
- `auth_json` jsonb null (must be redacted)
- `resolved_variables_json` jsonb not null
- `timeout_ms` integer not null
- `created_at` timestamptz not null default now()

### `request_run_responses`

- `id` bigint primary key
- `run_id` bigint not null unique (FK `request_runs`)
- `status_code` integer not null
- `headers_json` jsonb not null
- `body_text` text null
- `body_base64` text null (for binary responses)
- `size_bytes` integer not null
- `truncated` boolean not null default false
- `created_at` timestamptz not null default now()

### Recommended indexes

- `request_runs(workspace_id, created_at desc)`
- `request_runs(workspace_id, status, created_at desc)`
- `request_runs(initiated_by_user_id, created_at desc)`

### Write ordering constraints

- Insert `request_runs` row first (`running` for sync mode, `queued` for async mode).
- Insert `request_run_requests` exactly once per run.
- Upsert `request_run_responses` only for `completed` and response-bearing `failed` cases.
- Final status update on `request_runs` must set `completed_at` and `duration_ms` atomically.

## Concurrency plan

### v1: synchronous

- Run executes in request lifecycle.
- API returns final result directly.
- `cancel` endpoint may return `409` (`cannot cancel synchronous run`).

### v2: asynchronous worker

- API creates `queued` run.
- Worker transitions `queued -> running -> completed|failed|cancelled`.
- API returns status and final snapshots.
- Cancel endpoint sets cancellation intent; worker cooperates at safe checkpoints.

### State machine invariants

- Terminal states: `completed`, `failed`, `cancelled`.
- Terminal states are immutable.
- `duration_ms` is non-null only for terminal states.
- Exactly one of `response` or `error` is present for terminal non-cancelled runs.

## Observability

Structured run logs should include:

- `run_id`, `workspace_id`, `user_id`, `source_type`
- `target_host`, `method`, `status`, `duration_ms`
- policy deny/allow markers
- error code and class when failed
- no plaintext secrets

Future metrics:

- run count by status
- latency p50/p95/p99
- timeout rate
- policy-block rate
- truncation rate

## Testing plan

### Unit

- variable interpolation, precedence, and unresolved passthrough behavior
- policy matrix (allow/deny by scheme, host, and CIDR)
- redaction masking (headers, query, auth fields)
- truncation behavior for text and binary responses
- error mapping from internal exceptions to `RunnerPublicError`

### Service

- authz rules by workspace role
- source loading behavior for `adhoc` and `collectionEndpoint`
- request persistence and terminal state transitions
- API response projection excludes internal-only details

### Integration

- `POST /runs` and `GET /runs/:runId`
- blocked-policy scenarios
- timeout scenarios
- binary response handling and body capping

### E2E

- auth + workspace + environments + collections + runs full path
- cancellation flow in async mode

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

## Default decisions for implementation (v1)

- unresolved variables **pass through unchanged** (`{{missing}}`).
- workspace roles allowed to execute runs: `owner`, `admin`, `member`; `viewer` denied.
- config file is required at boot, with defaults generated by `engine-config.ts`.
- initial default response size cap in defaults file: `1MB` (`1048576` bytes).
- binary response persistence: allowed up to cap, retained with same policy as run rows.
- retention for run records: `30 days` default, configurable per deployment.

## Open decisions

- Should unresolved variables be configurable per workspace (strict vs passthrough)?
- Should cancellation map to `409` or `499` in API semantics?
- Should retention be workspace-tier dependent?

## Implementation checklist

- Define `runs.schema.ts` with strict union validation and option bounds.
- Add `runRequest` facade and enforce import boundary from `runs.service.ts`.
- Add config schema + loader + env overrides for `request-runner.config.json`.
- Add module registry and boot-time composition (`build-engine.ts`).
- Implement planner (`build source -> resolve vars -> resolve auth`) as pure functions.
- Add policy modules and central error translation.
- Add persistence adapters and state transition guards.
- Add tests for config validation and unknown-module startup failure.
- Add integration tests for policy blocks, timeouts, and redaction.

## Summary

The design keeps API exposure intentionally small while moving operational complexity into an internal runner engine. This version adds implementation-level defaults, state invariants, and execution contracts so teams can ship v1 quickly and migrate to async mode without breaking frontend behavior.
