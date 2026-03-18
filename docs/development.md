# Development

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`pnpm dev` runs startup validation before the HTTP server listens (unless disabled).

## Environment and startup integrity

Environment values are validated in `src/config/env.ts`.

Database-related environment variables:

- `DB_DIALECT`: `postgres` | `mysql` | `mariadb`
- `DATABASE_URL`: required connection URL
- `DB_POOL_MIN`: minimum connection pool size
- `DB_POOL_MAX`: maximum connection pool size
- `DB_SSL`: `true` | `false`
- `ENABLE_STARTUP_VALIDATION`: `true` | `false` (`false` skips startup DB checks)

Startup checks in `src/config/startup-validation.ts` verify:

- `DATABASE_URL` is present and a valid URL
- URL protocol matches `DB_DIALECT`
- Database is reachable (`SELECT 1`)

When local DB is not available yet, set `ENABLE_STARTUP_VALIDATION=false`.

## Build and run

```bash
pnpm build
pnpm start
```

## Scaffolding a module

```bash
pnpm create:module <module-name>
```

Example:

```bash
pnpm create:module audit-logs
```

See `docs/module-template.md` for generated files and post-generation steps.

## Testing

Run all tests once:

```bash
pnpm test:run
```

Run watch mode:

```bash
pnpm test:watch
```

Run coverage:

```bash
pnpm test:coverage
```

Coverage thresholds are defined in `vitest.config.ts`.

## Current testing strategy

- Unit tests (`tests/unit`): schemas, repo, service, middleware, logger, error classes.
- Unit tests (`tests/unit`) also cover DB adapters, DB client factory/config, and startup validation.
- Integration tests (`tests/integration`): HTTP behavior using `supertest` against `app`.
- Contract tests (`tests/contract`): response envelope and schema stability checks.
- Security tests (`tests/security`): malformed input and defensive HTTP behavior checks.
- Smoke tests (`tests/smoke`): quick baseline health checks.
- E2E tests (`tests/e2e`): full user flows across endpoints.

## Conventions for future development

- Keep module boundaries strict (no controller-to-repo direct access).
- Validate all external input with Zod schemas.
- Throw centralized `appResponse.withStatus(...)` payloads for expected domain failures.
- Keep side effects (I/O, DB) isolated to repository layer.
- Add tests for both happy paths and failure paths.

## Adding a new endpoint (checklist)

1. Update or create schema for input/output constraints.
2. Add/extend repo methods.
3. Add service logic and domain guards.
4. Add controller handler.
5. Register route.
6. Add unit tests (schema/service/repo).
7. Add integration tests for endpoint behavior.

## Suggested next upgrades

- Add schema migration workflow for multi-dialect environments.
- Add request logging middleware with request ids.
- Add auth module (JWT/session strategy).
- Add CI workflow for `build + test:coverage`.
- Add lint/format scripts and pre-commit hooks.
