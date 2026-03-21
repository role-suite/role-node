# role-node

TypeScript + Express backend starter focused on clean module boundaries, request validation, centralized error handling, and test coverage.

## Tech stack

- Node.js + TypeScript (ESM)
- Express 5
- Zod for runtime validation
- `pg` + `mysql2` for SQL connectivity
- Vitest + Supertest for multi-layer backend testing

## Project structure

```txt
src/
  app.ts                      # Express app wiring
  server.ts                   # Runtime bootstrap (listen)
  config/
    env.ts                    # Environment schema + parsing
    db.ts                     # DB client singleton + lifecycle
    startup-validation.ts     # Startup integrity and DB checks
  modules/
    auth/
      auth.route.ts
      auth.controller.ts
      auth.service.ts
      auth.repo.ts
      auth.schema.ts
    workspaces/
      workspaces.route.ts
      workspaces.controller.ts
      workspaces.service.ts
      workspaces.repo.ts
      workspaces.schema.ts
    collections/
      collections.route.ts
      collections.controller.ts
      collections.service.ts
      collections.repo.ts
      collections.schema.ts
    environments/
      environments.route.ts
      environments.controller.ts
      environments.service.ts
      environments.repo.ts
      environments.schema.ts
  shared/
    app-response.ts
    logger.ts
    db/
      client-factory.ts
      adapters/
        postgres.adapter.ts
        mysql.adapter.ts
    errors/
      db-error.ts
      error-handler.ts
    middleware/
      not-found.ts
  types/
    db.ts
tests/
  contract/
  e2e/
  integration/
  security/
  smoke/
  unit/
migrations/
  *.migration.ts
```

## Quick start

1. Install dependencies

```bash
pnpm install
```

2. Create your local environment file

```bash
cp .env.example .env
```

3. Start development server

```bash
pnpm dev
```

The server starts on `PORT` (default `3000`).

## Scripts

- `pnpm dev`: run server with file watch
- `pnpm build`: compile TypeScript to `dist/`
- `pnpm start`: run compiled server from `dist/`
- `pnpm create:module <name>`: scaffold a new feature module template
- `pnpm db:migrate`: apply pending migrations
- `pnpm db:migrate:up`: apply pending migrations (optionally with count)
- `pnpm db:migrate:down`: rollback latest migration (optionally with count)
- `pnpm db:migrate:status`: print applied/pending migration status
- `pnpm test`: run tests in Vitest
- `pnpm test:watch`: run tests in watch mode
- `pnpm test:run`: run tests once
- `pnpm test:coverage`: run tests with coverage report

## Environment variables

Validated in `src/config/env.ts` using Zod.

- `NODE_ENV`: `development` | `test` | `production` (default: `development`)
- `PORT`: positive integer (default: `3000`)
- `DB_DIALECT`: `postgres` | `mysql` | `mariadb` (default: `postgres`)
- `DATABASE_URL`: database connection URL
- `DB_POOL_MIN`: minimum pool size (default: `0`)
- `DB_POOL_MAX`: maximum pool size (default: `10`)
- `DB_SSL`: `true` | `false` (default: `false`)
- `ENABLE_STARTUP_VALIDATION`: `true` | `false` (default: `true`)

On startup, the app validates environment values and checks database connectivity with `SELECT 1` before listening for requests.
Set `ENABLE_STARTUP_VALIDATION=false` when running locally without a configured database.

## Testing layers

- `tests/unit`: isolated logic checks (service/repo/schema/middleware/logger/errors/db adapters)
- `tests/integration`: module HTTP behavior against Express app wiring
- `tests/contract`: API response shape and envelope contract checks
- `tests/security`: input hardening and defensive HTTP behavior checks
- `tests/smoke`: quick liveness and baseline runtime checks
- `tests/e2e`: end-to-end feature flows across multiple endpoints

## API overview

### Health

- `GET /health`

Response:

```json
{
  "success": true,
  "data": { "status": "ok" }
}
```

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Workspaces

- `GET /api/workspaces`
- `POST /api/workspaces`
- `GET /api/workspaces/:workspaceId`
- `GET /api/workspaces/:workspaceId/members`
- `POST /api/workspaces/:workspaceId/members`
- `PATCH /api/workspaces/:workspaceId/members/:memberUserId`
- `DELETE /api/workspaces/:workspaceId/members/:memberUserId`
- `POST /api/workspaces/:workspaceId/leave`

### Collections

- `GET /api/workspaces/:workspaceId/collections`
- `GET /api/workspaces/:workspaceId/collections/:collectionId`
- `POST /api/workspaces/:workspaceId/collections`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId`
- `GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `POST /api/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`

### Environments

- `GET /api/workspaces/:workspaceId/environments`
- `GET /api/workspaces/:workspaceId/environments/:environmentId`
- `POST /api/workspaces/:workspaceId/environments`
- `PATCH /api/workspaces/:workspaceId/environments/:environmentId`
- `DELETE /api/workspaces/:workspaceId/environments/:environmentId`
- `GET /api/workspaces/:workspaceId/environments/:environmentId/variables`
- `GET /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `POST /api/workspaces/:workspaceId/environments/:environmentId/variables`
- `PATCH /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `DELETE /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`

## Error handling

- Validation errors return `400` with `message: "Validation failed"`.
- Domain errors use centralized `appResponse.withStatus(...)` payloads with explicit status codes.
- Unknown errors return `500` with generic message.
- Unknown routes return `404` from `notFoundHandler`.

## Development guide

See:

- `docs/README.md`
- `docs/architecture/overview.md`
- `docs/guides/development.md`
- `docs/guides/module-template.md`
- `docs/modules/auth.md`
- `docs/modules/workspaces.md`
- `docs/modules/collections.md`
- `docs/modules/environments.md`
- `migrations/README.md`
