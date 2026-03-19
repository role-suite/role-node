# Architecture

This project uses a feature-first module layout with clear per-module layers.

## Layer responsibilities

- `route`: route registration and HTTP method/path mapping.
- `controller`: request parsing + schema validation + HTTP response handling.
- `service`: domain logic and business rules.
- `repo`: persistence and data access logic.
- `schema`: Zod schemas for runtime validation and type inference.

Current example modules: `src/modules/auth` and `src/modules/workspaces`.

## Runtime flow

1. `src/server.ts` validates startup constraints (when enabled) and starts listening.
2. `src/app.ts` runs middleware (`requestLogger`, `express.json`) and mounts routers.
3. Router delegates to controller handlers.
4. Controller parses params/body with Zod schemas.
5. Service executes business rules and throws domain errors via `appResponse.withStatus(...)`.
6. Repository reads/writes data.
7. `errorHandler` normalizes validation/domain/unexpected errors.

## Global app concerns

- `src/config/env.ts`: environment schema validation.
- `src/config/startup-validation.ts`: URL/dialect checks + DB connectivity check (`SELECT 1`).
- `src/config/db.ts`: singleton DB client lifecycle (`getDb`, `closeDb`).
- `src/shared/db/adapters/*`: PostgreSQL and MySQL/MariaDB client adapters.
- `src/shared/db/migrations/runner.ts`: migration table management + up/down/status operations.
- `src/shared/middleware/request-logger.ts`: per-request logging with `x-request-id` propagation.
- `src/shared/middleware/not-found.ts`: fallback 404 handler.
- `src/shared/errors/error-handler.ts`: centralized error mapping for Zod/domain/unexpected errors.
- `src/shared/logger.ts`: environment-aware logger output.

## Module extension pattern

When adding a feature module:

1. Generate scaffold with `pnpm create:module <module-name>`.
2. Implement domain schema/repo/service/controller logic.
3. Register `<module>Router` in `src/app.ts`.
4. Complete generated unit tests and unskip the integration test placeholder.

## Data layer status

Database infrastructure and migration tooling are in place, and auth/workspace flows are DB-backed. Generated module templates remain in-memory by default, so migrate each new module repo to shared DB clients as features become production-ready.
