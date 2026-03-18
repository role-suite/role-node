# Development

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`pnpm dev` runs startup validation before the HTTP server listens.

## Environment and startup integrity

Environment values are validated in `src/config/env.ts`.

Database-related environment variables:

- `DB_DIALECT`: `postgres` | `mysql` | `mariadb`
- `DATABASE_URL`: required connection URL
- `DB_POOL_MIN`: minimum connection pool size
- `DB_POOL_MAX`: maximum connection pool size
- `DB_SSL`: `true` | `false`

Startup checks in `src/config/startup-validation.ts` verify:

- `DATABASE_URL` is present and a valid URL
- URL protocol matches `DB_DIALECT`
- Database is reachable (`SELECT 1`)

## Build and run

```bash
pnpm build
pnpm start
```

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

## Conventions for future development

- Keep module boundaries strict (no controller-to-repo direct access).
- Validate all external input with Zod schemas.
- Throw `AppError` for expected domain failures.
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
