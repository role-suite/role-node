# Development

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`pnpm dev` runs startup validation before the HTTP server starts listening (unless disabled).

## Environment and startup integrity

Environment values are validated in `src/config/env.ts`.

Database-related environment variables:

- `DB_DIALECT`: `postgres` | `mysql` | `mariadb`
- `DATABASE_URL`: required when startup validation is enabled and for migration commands
- `DB_POOL_MIN`: minimum connection pool size
- `DB_POOL_MAX`: maximum connection pool size
- `DB_SSL`: `true` | `false`
- `ENABLE_STARTUP_VALIDATION`: `true` | `false` (`false` skips startup DB checks)

Startup checks in `src/config/startup-validation.ts` verify:

- `DATABASE_URL` is present and a valid URL
- URL protocol matches `DB_DIALECT`
- Database is reachable (`SELECT 1`)

When local DB is not available yet, set `ENABLE_STARTUP_VALIDATION=false`.

## Common scripts

- `pnpm dev`: start server with watch mode (`tsx` + `nodemon`)
- `pnpm build`: compile TypeScript to `dist/`
- `pnpm start`: run compiled server
- `pnpm create:module <name>`: scaffold module boilerplate and test stubs
- `pnpm db:migrate`: apply pending migrations
- `pnpm db:migrate:up [count]`: apply pending migrations (optionally limited)
- `pnpm db:migrate:down [count]`: rollback last applied migrations
- `pnpm db:migrate:status`: show applied/pending migration IDs

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

See `docs/guides/module-template.md` for generated files and post-generation steps.

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
pnpm db:migrate:up 2
pnpm db:migrate:down 1
```

See `migrations/README.md` for migration file template and dialect notes.

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

## Conventions

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

## Current improvement backlog

- Add async worker mode for request runs (`queued -> running -> terminal` transitions).
- Add run retention cleanup job for `request_runs` and related snapshots.
- Add CI workflow for `pnpm build` + `pnpm test:run` (and optional coverage gate).
- Add API contract docs (OpenAPI or equivalent).

## Documentation workflow

Treat docs as part of the deliverable for every feature change.

- Start from `docs/guides/system-handbook.md` for overall context.
- Update affected module docs in `docs/modules/` when behavior changes.
- Update user-facing contracts in `docs/guides/user-reference-manual.md` when payloads/status codes change.
- Update implementation playbooks/checklists in `docs/guides/implementation-manual.md` when team workflow changes.
- Keep `docs/README.md` aligned when new documents are added or renamed.
