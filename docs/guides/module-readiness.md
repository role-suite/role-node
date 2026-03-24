# Module-by-Module Readiness

This document defines the readiness bar for each backend module and provides a scorecard that teams can use during delivery and review.

## Readiness definition

A module is ready when all checks pass:

- route/controller/service/repo/schema boundaries are in place
- all external input is validated with strict schema rules
- authorization and ownership checks are implemented in service layer
- persistence is database-backed with migrations for shape changes
- unit and integration tests cover happy + failure paths
- module docs are updated and consistent with behavior

## Foundation status (project-level)

- layered architecture is established (`schema -> repo -> service -> controller -> route`)
- centralized success/error envelopes are in place (`appResponse` + `errorHandler`)
- request logging with request IDs is active
- DB adapters support `postgres`, `mysql`, and `mariadb`
- startup validation and migration tooling are implemented
- auth and workspace-scoped authorization are implemented
- multi-layer test suites (`unit`, `integration`, `contract`, `security`, `smoke`, `e2e`) exist

## Current module readiness snapshot

Status legend:

- `ready`: implementation and docs are operational with tests
- `enhance`: stable, but additional hardening/scale work remains

| Module        | Status  | Notes                                                                   |
| ------------- | ------- | ----------------------------------------------------------------------- |
| auth          | ready   | token/session lifecycle and workspace-aware context are implemented     |
| workspaces    | ready   | workspace/member lifecycle and role restrictions are implemented        |
| collections   | ready   | collections + endpoints + folders + examples are implemented            |
| environments  | ready   | environments and variables lifecycle are implemented                    |
| runs          | enhance | core execution path is implemented; async worker mode is a roadmap item |
| import-export | enhance | job APIs are implemented; current behavior is synchronous completion    |

## Scale-up gaps to address

1. Standardized pagination/filtering contract for list endpoints.
2. Stable machine-readable domain error codes across modules.
3. CI workflow enforcing `pnpm build` and `pnpm test:run` on PRs.
4. OpenAPI (or equivalent) publication pipeline for API contracts.
5. Operational jobs for retention and cleanup of historical run/import-export records.

## Module readiness review checklist

- [ ] API paths and payloads documented in `docs/modules/<module>.md`
- [ ] user-facing contract updated in `docs/guides/user-reference-manual.md`
- [ ] migration added (when persistence changed) with rollback path
- [ ] tests include role/permission and ownership failure cases
- [ ] no business logic in route/controller layers
- [ ] build and tests pass locally (`pnpm build`, `pnpm test:run`)
