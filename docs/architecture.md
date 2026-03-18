# Architecture

This project uses a feature-first module layout and simple layer separation inside each module.

## Layer responsibilities

- `route`: HTTP route registration only.
- `controller`: parse request inputs and return HTTP responses.
- `service`: business logic and domain checks.
- `repo`: data access and persistence abstraction.
- `schema`: Zod schemas for runtime validation and TS inference.

Current example module: `src/modules/users`.

## Request lifecycle

1. `app.ts` registers middleware and module routes.
2. Route delegates to controller.
3. Controller validates inputs with Zod schema.
4. Service runs business logic.
5. Repo reads/writes data source.
6. Errors bubble to `errorHandler`.

## Global app concerns

- `src/config/env.ts`: validates environment before app boot.
- `src/config/startup-validation.ts`: validates DB URL/dialect consistency and DB readiness (toggleable with `ENABLE_STARTUP_VALIDATION`).
- `src/config/db.ts`: creates and manages singleton DB client lifecycle.
- `src/shared/db/*`: adapter and driver integration (PostgreSQL, MySQL/MariaDB).
- `src/types/db.ts`: shared DB client and query contracts.
- `src/shared/errors/error-handler.ts`: maps known errors to HTTP responses.
- `src/shared/errors/db-error.ts`: normalizes database-layer failures.
- `src/shared/middleware/not-found.ts`: handles unmatched routes.
- `src/shared/logger.ts`: environment-aware logger (readable dev output, structured JSON in production).

## Extending architecture

When adding a new feature module:

1. Create `src/modules/<feature>/`.
2. Add `*.schema.ts`, `*.repo.ts`, `*.service.ts`, `*.controller.ts`, `*.route.ts`.
3. Register `<feature>Router` in `src/app.ts`.
4. Add unit tests for schema/service/repo and integration tests for routes.

## Data layer note

Database infrastructure is centralized under `shared/db` and `config/db`, while SQL/query logic belongs in module repositories only (`src/modules/*/*.repo.ts`).

Current `users.repo.ts` still uses in-memory state for demo/test speed; migrate module repos incrementally to the shared DB client without changing controller/service contracts.
