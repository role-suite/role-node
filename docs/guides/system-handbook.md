# System Handbook

This handbook is the canonical, book-style system document for `role-node`.

It is written for backend engineers, frontend integrators, QA engineers, and maintainers who need full context from runtime startup to module-level behavior.

## 1. Purpose and audience

Use this handbook when you need to:

- understand how the backend is organized and why
- implement features without violating module boundaries
- troubleshoot runtime, migration, or policy issues quickly
- map an API endpoint to service, repo, schema, and persistence behavior

Supplemental docs:

- architecture internals: `docs/architecture/overview.md`
- runner deep design: `docs/architecture/request-runner-engine.md`
- endpoint contracts and payloads: `docs/guides/user-reference-manual.md`
- implementation playbooks: `docs/guides/implementation-manual.md`

## 2. System overview

`role-node` is a TypeScript + Express backend with workspace-scoped resources and strict module boundaries.

Core principles:

- schema-first input validation using Zod
- thin controllers and route files
- business logic in services
- data access isolated in repositories
- centralized API response and error shape
- workspace-aware authentication and authorization

Primary runtime entrypoints:

- `src/server.ts`: boot sequence and shutdown handling
- `src/app.ts`: middleware and router composition

## 3. Runtime lifecycle

Startup flow:

1. environment is parsed and validated by `src/config/env.ts`
2. startup validation runs when `ENABLE_STARTUP_VALIDATION=true`
3. database URL/dialect/connectivity checks run via `src/config/startup-validation.ts`
4. HTTP server listens on `PORT`

Request flow:

1. `requestLogger` assigns/propagates request id
2. `express.json()` parses JSON payloads
3. route handler delegates to controller
4. controller parses schemas and calls service
5. service enforces business and permission rules
6. repo executes persistence operations
7. `errorHandler` normalizes expected/unexpected failures

Termination flow:

- `SIGINT` and `SIGTERM` trigger graceful DB shutdown through `closeDb()`

## 4. Architecture map

Module layering convention:

- `*.route.ts`: URL mapping only
- `*.controller.ts`: request parsing + response shaping
- `*.service.ts`: business rules and authorization rules
- `*.repo.ts`: SQL and persistence mapping
- `*.schema.ts`: Zod schemas and inferred request types

Top-level boundaries:

- external API modules live in `src/modules/*`
- shared middleware/utilities live in `src/shared/*`
- request execution engine internals live in `src/internal/runner/*`

## 5. Security and access model

Authentication:

- JWT access and refresh token model
- refresh session persistence and rotation
- refresh token hash stored server-side (not plaintext)

Authorization:

- all `/api/workspaces/*` routes require auth middleware
- services enforce workspace membership and role-specific write permissions
- owner/admin/member roles are used per module policy

Request execution hardening:

- network policy blocks localhost/private targets by default
- timeout and request/response size limits are config-driven
- redaction masks sensitive auth/header/query data in snapshots and responses

## 6. Configuration reference

Environment variables are validated in `src/config/env.ts`.

Platform/runtime:

- `NODE_ENV`, `PORT`, `ENABLE_STARTUP_VALIDATION`

Database:

- `DB_DIALECT`, `DATABASE_URL`, `DB_POOL_MIN`, `DB_POOL_MAX`, `DB_SSL`

Auth/token:

- `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET`
- `AUTH_ACCESS_TOKEN_TTL_SECONDS`, `AUTH_REFRESH_TOKEN_TTL_SECONDS`

Runner config files:

- `config/request-runner.config.json`
- optional local override: `config/request-runner.config.local.json`

## 7. API surface map

Health:

- `GET /health`

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Workspaces:

- `GET /api/workspaces`
- `POST /api/workspaces`
- `GET /api/workspaces/:workspaceId`
- `GET /api/workspaces/:workspaceId/members`
- `POST /api/workspaces/:workspaceId/members`
- `PATCH /api/workspaces/:workspaceId/members/:memberUserId`
- `DELETE /api/workspaces/:workspaceId/members/:memberUserId`
- `POST /api/workspaces/:workspaceId/leave`

Collections:

- collection CRUD, endpoint CRUD, folder CRUD, endpoint example CRUD under `/api/workspaces/:workspaceId/collections/*`

Environments:

- environment CRUD and variable CRUD under `/api/workspaces/:workspaceId/environments/*`

Runs:

- `POST /api/workspaces/:workspaceId/runs`
- `GET /api/workspaces/:workspaceId/runs/:runId`
- `POST /api/workspaces/:workspaceId/runs/:runId/cancel`

Import/Export:

- `GET /api/workspaces/:workspaceId/import-export/jobs`
- `GET /api/workspaces/:workspaceId/import-export/jobs/:jobId`
- `POST /api/workspaces/:workspaceId/import-export/exports`
- `POST /api/workspaces/:workspaceId/import-export/imports`

For full payload samples and status code behavior, use `docs/guides/user-reference-manual.md`.

## 8. Domain and persistence map

Major schema areas:

- auth and sessions: users, workspaces, memberships, sessions
- API design resources: collections, endpoints, folders, endpoint examples
- environment configuration: environments and variables
- run execution telemetry: run/request/response snapshots
- import/export history: workspace job timeline

Migration files are stored in `migrations/` and executed via migration scripts.

## 9. Testing strategy

Test layers:

- `tests/unit`: schema, service, repo, middleware, helpers
- `tests/integration`: module HTTP behavior through Express wiring
- `tests/contract`: response envelope and shape stability checks
- `tests/security`: malformed input and safety controls
- `tests/smoke`: baseline application behavior
- `tests/e2e`: full user-level flows across modules

Core commands:

```bash
pnpm test:run
pnpm test:watch
pnpm test:coverage
pnpm build
```

## 10. Day-2 operations

Local development baseline:

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm dev
```

Migration operations:

```bash
pnpm db:migrate
pnpm db:migrate:up
pnpm db:migrate:down
pnpm db:migrate:status
```

Operational troubleshooting order:

1. verify `/health`
2. verify env parsing/startup validation logs
3. verify DB reachability and migration status
4. verify auth context (`/api/auth/me`) with current token
5. verify workspace membership and role for failing endpoint

## 11. Implementation and documentation workflow

When adding or changing features:

1. define/update schema contracts first
2. implement repo + service + controller + route changes
3. add/update tests (unit + integration minimum)
4. update module docs in `docs/modules/*`
5. update one or more guides in `docs/guides/*`
6. update index links in `docs/README.md` when new docs are added

Documentation quality bar:

- include endpoint path and authorization behavior
- include payload examples for create/update flows
- include status/error outcomes for common failure scenarios
- include persistence/migration notes when DB model changes
- include test coverage impact for new behavior

## 12. Glossary

- `workspace`: top-level tenant boundary for user collaboration
- `membership`: user role assignment within a workspace
- `collection`: grouped API endpoints saved in a workspace
- `endpoint`: callable HTTP definition inside a collection
- `environment`: named variable set used during request execution
- `run`: single request execution record with snapshots and status
- `import/export job`: workspace-scoped data transfer operation record

## 13. Change log policy for docs

Treat docs as production artifacts.

- update docs in the same PR that changes behavior
- prefer additive clarifications over ambiguous shorthand
- keep examples executable and aligned with current route contracts
