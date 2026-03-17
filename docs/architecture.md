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
- `src/shared/errors/error-handler.ts`: maps known errors to HTTP responses.
- `src/shared/middleware/not-found.ts`: handles unmatched routes.
- `src/shared/logger.ts`: simple JSON console logger.

## Extending architecture

When adding a new feature module:

1. Create `src/modules/<feature>/`.
2. Add `*.schema.ts`, `*.repo.ts`, `*.service.ts`, `*.controller.ts`, `*.route.ts`.
3. Register `<feature>Router` in `src/app.ts`.
4. Add unit tests for schema/service/repo and integration tests for routes.

## Data layer note

`users.repo.ts` currently uses in-memory state for demo/test speed. Replace repo internals with a real database implementation later while keeping service/controller contracts stable.
