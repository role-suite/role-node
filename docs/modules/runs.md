# Runs Module

This module exposes workspace-scoped request execution endpoints and delegates execution to the internal runner engine.

## Endpoints

- `POST /api/workspaces/:workspaceId/runs`
- `GET /api/workspaces/:workspaceId/runs/:runId`
- `POST /api/workspaces/:workspaceId/runs/:runId/cancel`

All routes require authenticated context via workspace auth middleware.

## Request execution sources

- `adhoc`: run with full HTTP request payload in request body.
- `collectionEndpoint`: run using a saved collection endpoint reference.

## Module boundaries

- Public module files:
  - `src/modules/runs/runs.route.ts`
  - `src/modules/runs/runs.controller.ts`
  - `src/modules/runs/runs.service.ts`
  - `src/modules/runs/runs.repo.ts`
  - `src/modules/runs/runs.schema.ts`
- Internal engine entrypoint:
  - `src/internal/runner/index.ts`

`runs.service.ts` calls the engine facade (`runRequest`, `getRunById`, `cancelRun`) and maps engine failures to HTTP statuses.

## Runner config

- Base config file: `config/request-runner.config.json`
- Optional local override (gitignored): `config/request-runner.config.local.json`
- Config schema and loader:
  - `src/internal/runner/config/engine-config.ts`
  - `src/internal/runner/config/engine-config-loader.ts`

## Persistence

DB tables created by migration `migrations/20260322_006_create_request_runs_tables.migration.ts`:

- `request_runs`
- `request_run_requests`
- `request_run_responses`

The repository persists normalized request/response snapshots and terminal run status/error metadata.

## Security and policies

- Network policy blocks localhost/private targets by default.
- Request and response limits are config-driven (`timeoutMs`, request/response size caps).
- Secret redaction masks sensitive header/query/auth values in stored snapshots and API responses.

## Test coverage

- Integration: `tests/integration/runs.test.ts`
- Unit:
  - `tests/unit/runs.schema.test.ts`
  - `tests/unit/request-runner-config.test.ts`
