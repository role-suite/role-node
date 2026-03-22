# Developer Manual

This manual is for contributors implementing, reviewing, and maintaining backend features.

## 1. System architecture

Core app wiring lives in `src/app.ts`.

- `requestLogger` middleware runs first
- `express.json()` parses JSON payloads
- Routes:
  - `/api/auth` (public + authenticated user profile)
  - `/api/workspaces` (auth required)
- `notFoundHandler` and `errorHandler` are terminal middleware

The system follows module boundaries:

- `schema` validates input contracts
- `controller` parses request + delegates
- `service` enforces domain rules
- `repo` contains all database I/O
- `route` maps URL to controller

## 2. Runtime and configuration

Environment validation: `src/config/env.ts`

Important values:

- `DB_DIALECT`, `DATABASE_URL`, `DB_POOL_MIN`, `DB_POOL_MAX`, `DB_SSL`
- `ENABLE_STARTUP_VALIDATION`
- `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET`
- `AUTH_ACCESS_TOKEN_TTL_SECONDS`, `AUTH_REFRESH_TOKEN_TTL_SECONDS`

Startup checks: `src/config/startup-validation.ts`

- validates DB URL and dialect compatibility
- validates DB connectivity with `SELECT 1`

## 3. Database and migrations

Migration folder: `migrations/`

Naming format:

- `<timestamp-or-seq>_<name>.migration.ts`

Commands:

```bash
pnpm db:migrate
pnpm db:migrate:up
pnpm db:migrate:down
pnpm db:migrate:status
```

Current major schema areas:

- auth users/sessions/workspaces/memberships
- collections/endpoints/folders/endpoint_examples
- environments/environment_variables
- request runs and snapshots
- import/export jobs

## 4. Auth and access model

### Auth tokens

- Access and refresh tokens are both JWT-based
- Refresh token session is persisted and validated against hash
- Refresh flow revokes old session and issues new pair

### Auth middleware

`src/shared/middleware/require-auth.ts`:

- reads Bearer token
- verifies token signature
- validates user/workspace/membership still exists
- sets `req.auth`

### Authorization pattern

Services use repository checks for workspace membership and role guardrails.

Common helper style:

- `requireWorkspaceMembership(...)`
- `requireWorkspaceWriterRole(...)`

## 5. Runner engine model

Runner internals: `src/internal/runner/`

Pipeline shape (high level):

1. Build source request (adhoc or collection endpoint)
2. Resolve variables (environment + overrides)
3. Resolve auth headers
4. Enforce limits and network policy
5. Execute HTTP call
6. Redact sensitive values
7. Persist run and snapshots

Important files:

- `src/internal/runner/core/types.ts`
- `src/internal/runner/planning/plan-builder.ts`
- `src/internal/runner/planning/variable-resolver.ts`
- `src/internal/runner/execution/http-client.ts`
- `src/internal/runner/policy/limits-policy.ts`
- `src/internal/runner/policy/redaction-policy.ts`

### Request body support

Current `HttpRequestBody` modes:

- `raw`
- `urlencoded`
- `formdata`
- `binary`
- `none`

## 6. API contract style

Response helper: `src/shared/app-response.ts`

- success: `appResponse.sendSuccess(res, status, data)`
- expected error: throw `appResponse.withStatus(...)`
- centralized fallback in `errorHandler`

Contract expectation:

- all public input validated by Zod
- services throw domain errors (not controllers)
- controllers stay thin

## 7. Testing strategy

Test layers:

- unit: schemas/services/repo policies and helpers
- integration: endpoint behavior through express app
- contract: API envelope and shape stability
- security: malformed input and protective checks
- smoke: baseline runtime health
- e2e: full user flows

Core commands:

```bash
pnpm test:run
pnpm test:watch
pnpm test:coverage
pnpm build
```

## 8. Contributor workflow

1. Create branch
2. Implement by module boundary (schema -> repo -> service -> controller -> route)
3. Add migration if persistence changes
4. Add or update tests (unit + integration minimum)
5. Run build + tests locally
6. Update docs in `docs/modules` and `docs/guides`

## 9. Coding rules used in this repository

- Keep business logic in services
- Keep SQL in repositories
- Keep route files declarative
- Prefer explicit status/error messages
- Preserve backward-compatible payload parsing when evolving contracts

## 10. Observed backlog after current implementation

- collection versioning snapshots
- collection fork/merge workflows
- list/filter endpoint for run history
- CI workflow automation and OpenAPI publication

## 11. Where to document new features

When adding a feature:

1. update module doc in `docs/modules/<module>.md`
2. update relevant guide in `docs/guides/`
3. update top-level references in `docs/README.md` and `README.md` when needed
