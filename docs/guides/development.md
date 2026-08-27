# Development

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`pnpm dev` runs startup validation before the HTTP server starts listening (unless disabled).

Once the server is running, open `http://localhost:<PORT>/docs` for interactive Swagger UI docs
(request/try-it-out against the real API with a bearer token). Only mounted when
`NODE_ENV !== "production"`.

## Environment and startup integrity

Environment values are validated in `src/config/env.ts`.

Database-related environment variables:

- `NODE_ENV`: `development` | `test` | `production`
- `PORT`: HTTP server port
- `DB_HOST`: required database host
- `DB_PORT`: required database port
- `DB_USER`: required database user
- `DB_PASSWORD`: required database password
- `DB_NAME`: required database name
- `DB_POOL_MIN`: minimum connection pool size
- `DB_POOL_MAX`: maximum connection pool size
- `DB_SSL`: `true` | `false`
- `ENABLE_STARTUP_VALIDATION`: `true` | `false` (`false` skips startup DB checks)

Startup checks in `src/config/startup-validation.ts` verify:

- app `PORT` is within valid range
- Database is reachable (`SELECT 1`)

When local DB is not available yet, set `ENABLE_STARTUP_VALIDATION=false`.

## Common scripts

- `pnpm dev`: start server with watch mode (`tsx` + `nodemon`)
- `pnpm build`: compile TypeScript to `dist/`
- `pnpm start`: run compiled server
- `pnpm db:migrate`: apply pending migrations
- `pnpm db:migrate:up [count]`: apply pending migrations (optionally limited)
- `pnpm db:migrate:down [count]`: rollback last applied migrations
- `pnpm db:migrate:status`: show applied/pending migration IDs
- `pnpm db:reset:docker`: reset dockerized DBs (down -v, up -d)
- `pnpm verify`: run full local quality checks

## CI/CD

- CI workflow: `.github/workflows/ci.yml` runs format, lint, test, build, and a final status gate.
- Security workflow: `.github/workflows/security.yml` runs dependency audit and secret scanning.
- CodeQL workflow: `.github/workflows/codeql.yml` runs static analysis for Actions and TypeScript.
- Coverage badge workflow: `.github/workflows/coverage-badge.yml` updates `docs/badges/coverage.svg` on pushes to `main`.
- CD workflow: `.github/workflows/cd.yml` builds and publishes Docker images to GHCR and deploys production from `v*` tags or manual dispatch.
- Release workflow: `.github/workflows/release-tag.yml` performs semantic versioning from manual dispatch and creates the GitHub Release.

## Build and run

```bash
pnpm build
pnpm start
```

## Database migrations

Migration files are placed in `migrations/` and must match:

- `<timestamp-or-seq>_<name>.migration.ts`

Commands:

```bash
pnpm db:migrate
pnpm db:migrate:up
pnpm db:migrate:status
pnpm db:migrate:down
```

Optional count examples:

```bash
pnpm db:migrate up 2
pnpm db:migrate down 1
```

See `migrations/README.md` for migration file template and Postgres notes.

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
- Security tests (`tests/security`): malformed input and defensive HTTP behavior checks.
- Smoke tests (`tests/smoke`): quick baseline health checks.
- E2E tests (`tests/e2e`): full user flows across endpoints.

## Known runtime caveats

- JSON request bodies are capped by `REQUEST_BODY_LIMIT`, default `1mb`, through `express.json({ limit: ... })` in `src/app.ts`.
- Exceeding the body limit currently falls through the generic error-handler branch and may surface as `500 INTERNAL_SERVER_ERROR` instead of `413`.

## Conventions

- Keep module boundaries strict (no controller-to-repo direct access).
- Validate all external input with Zod schemas.
- Throw centralized `appResponse.withStatus(...)` payloads for expected domain failures.
- Keep side effects (I/O, DB) isolated to repository layer.
- Add tests for both happy paths and failure paths.

## Implementation checklists

See `docs/guides/implementation-manual.md` for endpoint implementation playbooks and documentation update checklists.
