# role-node

TypeScript + Express backend starter focused on clean module boundaries, request validation, centralized error handling, and test coverage.

## Tech stack

- Node.js + TypeScript (ESM)
- Express 5
- Zod for runtime validation
- Vitest + Supertest for unit/integration tests

## Project structure

```txt
src/
  app.ts                      # Express app wiring
  server.ts                   # Runtime bootstrap (listen)
  config/
    env.ts                    # Environment schema + parsing
  modules/
    users/
      users.route.ts
      users.controller.ts
      users.service.ts
      users.repo.ts
      users.schema.ts
  shared/
    logger.ts
    errors/
      app-error.ts
      error-handler.ts
    middleware/
      not-found.ts
  types/
tests/
  integration/
  unit/
```

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create your local environment file

```bash
cp .env.example .env
```

3. Start development server

```bash
npm run dev
```

The server starts on `PORT` (default `3000`).

## Scripts

- `npm run dev`: run server with file watch
- `npm run build`: compile TypeScript to `dist/`
- `npm run start`: run compiled server from `dist/`
- `npm test`: run tests in Vitest
- `npm run test:watch`: run tests in watch mode
- `npm run test:run`: run tests once
- `npm run test:coverage`: run tests with coverage report

## Environment variables

Validated in `src/config/env.ts` using Zod.

- `NODE_ENV`: `development` | `test` | `production` (default: `development`)
- `PORT`: positive integer (default: `3000`)

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
