# Implementation Manual

This manual is a practical playbook for implementing new backend features in this repository.

It is intentionally process-heavy so contributors can ship changes consistently.

## 1. Definition of implementation completion

A feature is complete only when all are true:

- Input schema exists and validates all external payloads
- Route/controller/service/repo layers are aligned
- DB migrations are present for persistence changes
- Unit and integration tests cover happy and failure paths
- Module docs are updated
- `pnpm build` and `pnpm test:run` pass locally

## 2. Standard feature workflow

### Step 1: Clarify scope

Write explicit answers before coding:

- Which endpoint(s) are added or changed?
- Which roles can read/write?
- Which existing payloads must remain backward compatible?
- What data is persisted?
- What are expected error cases?

### Step 2: Schema-first contract

Start in `<module>.schema.ts`.

Checklist:

- define route param schemas
- define create/update schemas
- use `.strict()`
- enforce non-empty update payload with `.refine(...)`
- export inferred types

### Step 3: Repo persistence

Add or extend repository methods in `<module>.repo.ts`.

Checklist:

- support postgres and mysql/mariadb token syntax
- map row types to domain types with explicit mappers
- sort deterministic list queries
- avoid business logic in SQL layer

### Step 4: Service rules

Add service methods in `<module>.service.ts`.

Checklist:

- enforce membership and role access
- validate cross-entity ownership (workspace/collection relationships)
- map repo entities to API response shape
- throw expected domain failures via `appResponse.withStatus(...)`

### Step 5: Controller and routes

Controller responsibilities:

- parse params/body with schemas
- call service
- return `appResponse.sendSuccess(...)`

Route responsibilities:

- register URL + controller handler only
- no business logic in route files

### Step 6: Migration (if needed)

Create migration in `migrations/`.

Checklist:

- `up` path for postgres and mysql/mariadb
- `down` path rollback compatibility
- index frequently filtered columns
- foreign key behavior is explicit (`CASCADE`, `SET NULL`, etc.)

### Step 7: Tests

Minimum expected tests:

- schema unit tests for new payloads and invalid variants
- service unit/integration tests for role and ownership rules
- integration tests for end-to-end endpoint behavior

### Step 8: Documentation

Update at least:

- `docs/modules/<module>.md`
- `README.md` endpoint list if public API changed
- relevant guide in `docs/guides/`

## 3. Playbook A: Add a new CRUD resource inside a module

Example pattern: adding `examples` under collection endpoints.

1. Add param and payload schemas
2. Add row type and mapper in repo
3. Add repo methods:

- create
- list by parent
- find by id
- update
- delete

4. Add service methods with ownership checks
5. Add controller handlers
6. Register routes
7. Add tests for create/list/update/delete + permission failures
8. Update docs

## 4. Playbook B: Add hierarchy support (folder/subfolder)

1. DB model:

- new table with `parent_id` nullable
- FK to self table
- index `collection_id`, `parent_id`

2. Schema:

- include `parentFolderId` nullable optional
- prevent empty update payload

3. Service checks:

- parent exists in same collection
- folder cannot parent itself
- enforce writer role for mutations

4. Endpoint relationships:

- add `folderId` to endpoint schema and persistence

5. Tests:

- parent validity
- invalid cross-collection parent
- write denied for member role

## 5. Playbook C: Extend request runner payloads

When adding a request body/auth mode, update all related layers.

Required touchpoints:

- `src/modules/runs/runs.schema.ts`
- `src/modules/collections/collections.schema.ts` if collection endpoint contract changes
- `src/internal/runner/core/types.ts`
- `src/internal/runner/planning/*` (source parsing, variable resolution)
- `src/internal/runner/execution/http-client.ts`
- `src/internal/runner/policy/*` (limits and redaction)
- `src/modules/runs/runs.repo.ts` persistence serialization

Backward compatibility strategy:

- keep legacy schema transforms if old payload shape exists in clients
- normalize old payloads before execution

## 6. Playbook D: Add role-dependent behavior

Patterns used in codebase:

- read operations: require membership
- write operations: require owner/admin in most modules
- member management: owner-only

Implementation tips:

- create small `require...` helpers in service
- use clear, stable error messages
- test all three roles (`owner`, `admin`, `member`) when relevant

## 7. Playbook E: Import/export-affecting changes

When resource shape changes (for example folders/examples/body modes):

1. extend export summary/details generation
2. extend import parser and validation
3. ensure roundtrip compatibility in tests
4. document schema version expectations

## 8. Pull request checklist

- [ ] schemas updated and strict
- [ ] repos updated for both SQL dialect paths
- [ ] service guards include access + ownership checks
- [ ] routes/controllers wired and tested
- [ ] migrations added with rollback path
- [ ] tests added/updated
- [ ] docs updated
- [ ] `pnpm build` and `pnpm test:run` pass

## 9. Common implementation mistakes to avoid

- skipping schema validation for optional nested payloads
- putting permission checks in controller instead of service
- missing mysql/mariadb SQL path while adding postgres-only query
- forgetting to serialize/deserialize JSON columns consistently
- not updating test DB helper (`tests/helpers/auth-test-db.ts`) after SQL query changes
- changing API contract without documenting backward compatibility behavior

## 10. Suggested implementation order for roadmap features

For pending high-value features:

1. run listing/pagination
2. collection versioning snapshots
3. fork/merge workflow
4. import/export full-fidelity payloads
5. OpenAPI publication and CI pipeline hardening
