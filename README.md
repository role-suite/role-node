# role-node

TypeScript + Express backend starter focused on clean module boundaries, request validation, centralized error handling, and test coverage.

## Tech stack

- Node.js + TypeScript (ESM)
- Express 5
- Zod for runtime validation
- `pg` + `mysql2` for SQL connectivity
- Vitest + Supertest for unit/integration tests

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
    users/
      users.route.ts
      users.controller.ts
      users.service.ts
      users.repo.ts
      users.schema.ts
  shared/
    logger.ts
    db/
      client-factory.ts
      adapters/
        postgres.adapter.ts
        mysql.adapter.ts
    errors/
      app-error.ts
      db-error.ts
      error-handler.ts
    middleware/
      not-found.ts
  types/
    db.ts
tests/
  integration/
  unit/
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

On startup, the app validates environment values and checks database connectivity with `SELECT 1` before listening for requests.

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

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`

`POST /api/users` payload:

```json
{
  "name": "Altay",
  "email": "altay@example.com"
}
```

Validation rules:

- `name`: string, min 2, max 80 chars
- `email`: valid email

## Error handling

- Validation errors return `400` with `message: "Validation failed"`.
- Domain errors use `AppError` with explicit status code.
- Unknown errors return `500` with generic message.
- Unknown routes return `404` from `notFoundHandler`.

## Development guide

See:

- `docs/architecture.md`
- `docs/development.md`
