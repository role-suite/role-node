# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## Unreleased

### Fixed

- Import/export: `POST /import-export/imports` now runs the entire import (collections, folders,
  endpoints, examples, environments, variables, and the job record) inside a single DB
  transaction. Previously a failure partway through (e.g. an environment name that already
  existed) left the already-created collections/environments permanently in the database with no
  job record to explain how they got there; now the whole import rolls back cleanly.
- Import/export: a folder/endpoint referencing an unknown `parentSourceId`/`folderSourceId` no
  longer silently reparents to the collection root. It's rejected up front with
  `400 IMPORT_EXPORT_INVALID_SOURCE_REFERENCE`, before any row is written.
- `DatabaseClient.transaction()` (`src/shared/db/postgres-client.ts`) no longer re-wraps a
  deliberately-thrown `AppError` (e.g. a transaction callback catching a unique-violation and
  raising a friendly `409`) into a generic `500`. Only genuinely unexpected errors get wrapped.
- Workspaces: `POST /api/workspaces` now creates the workspace and the owner membership inside a
  single DB transaction (the same pattern already used by auth registration), so a failure
  partway through can no longer leave an ownerless, orphaned workspace behind.
- Workspaces: `POST /api/workspaces/:workspaceId/members` and `POST /api/workspaces/join` no
  longer risk an unhandled `500` when two requests race to add/join the same
  user (a double-submitted "join", or an owner's `addMember` racing an invitee's `join` for the
  same email). Both now resolve the DB's `UNIQUE(user_id, workspace_id)` violation to the same
  friendly `409 User is already a workspace member`. `join`'s membership create and the
  invitation's accepted-at update now also run in one transaction.
- Workspaces: `GET /api/workspaces/:workspaceId/updates` cursor pagination reported
  `hasMore: true` whenever a page happened to be full, even when there were no events left after
  it (`mapped.length === limit` can't tell those apart). It now fetches one extra row to
  determine `hasMore` correctly.

### Added

- `docs/guides/client-integration.md`: cross-links the per-module reference docs
  (`docs/modules/*.md`), points to the OpenAPI spec (`/docs/openapi.json`, `/docs`) as the
  fastest path to a generated typed client, flags that `role-sdk`/`role-client`'s
  language/platform isn't documented anywhere in this repo (don't assume they apply to a new
  client without confirming), and documents that `collections`/`environments`/`workspaces`
  list endpoints are unbounded (no `limit`/`offset`/cursor) — only
  `GET /workspaces/:workspaceId/updates` is paginated.
- Import/export: a completed import (`POST /import-export/imports`) now publishes a
  `workspace_events` row (`entity: "import_export_job"`, `action: "completed"`) inside the same
  transaction as the rest of the import. Previously a bulk import could add many
  collections/environments in one call with no trace in `GET /workspaces/:workspaceId/updates`,
  so other clients/teammates polling that feed had no way to learn the import happened.
- Interactive API docs at `/docs` (disabled in production): an OpenAPI 3.1 spec generated from
  the existing zod request/response schemas, served through Swagger UI so every endpoint is
  directly testable ("Try it out") with a real bearer token. Every request body ships a realistic
  example value, and the operation list starts fully collapsed (`docExpansion: "none"`). The raw
  spec is also available at `/docs/openapi.json`.

### Changed

- **Breaking:** every REST route now lives under `/api/v1` instead of `/api` (`API_PREFIX` in
  `src/shared/routes.ts`). Added ahead of any real client so the seam exists before there's an
  installed base to break: once a published mobile/desktop app is in the field, old versions
  keep calling the API for weeks after a server release (app store review lag, users who don't
  update), so future breaking changes need a version bump (`/api/v2`) rather than an in-place
  change to `/api/v1`. See `docs/compatibility.md` for the version-bump policy.
- Auth registration (`POST /api/auth/register`) now creates the user, workspace, and owner
  membership inside a single DB transaction, so a partial failure can no longer leave an
  orphaned user without a workspace.
- Auth email handling (register/login) is now case-insensitive: email is lowercased before
  lookup, the duplicate-account check, and storage.
- `registerSchema` now uses a discriminated union on `accountType`; `teamName` is required at
  the type level for `accountType: "team"` instead of only at runtime.
- Reduced auth DB round trips: `requireAuth`, `/me`, and `refresh` now resolve user/workspace/
  membership via a single joined query instead of three separate lookups; `/me` and register/
  login/refresh membership hydration no longer does one query per membership (N+1).
- Renamed `ERROR_CODES.workspaces.WORKSPACE_ACCESS_DENIED` / `WORKSPACE_NOT_FOUND` to
  `ACCESS_DENIED` / `NOT_FOUND` for consistency with the other error-code groups. The wire-level
  error code strings (`WORKSPACE_ACCESS_DENIED`, `WORKSPACE_NOT_FOUND`) are unchanged.
- Removed the vestigial `DbDialect`/`dialect` abstraction (`DatabaseClient`, `DbError`,
  migration runner) left over from prior multi-backend DB support; the project now targets
  Postgres only.
- Raised the auth password length cap from 72 to 128 characters (the old value was a leftover
  bcrypt truncation limit; argon2 has no such limit).
- Environments: duplicate environment name / variable key checks are no longer a plain
  check-then-write race. The pre-check is kept for a fast, friendly error, but the DB's `UNIQUE`
  constraints now back it up, so a concurrent duplicate create/rename resolves to
  `409 Environment name already exists` / `409 Environment variable key already exists` instead
  of occasionally leaking a `500`.
- Environments: removed a redundant workspace-existence lookup from `GET /environments` and
  `POST /environments` (workspace membership already guarantees the workspace exists); `PATCH`
  on an environment/variable now returns the updated row directly from the `UPDATE ... RETURNING`
  query instead of issuing a follow-up `SELECT`.
- Extracted the unique-violation check (`isUniqueViolation`) out of the environments service into
  `src/shared/errors/db-error.ts` so import-export can reuse it for the same constraints.
- Import/export: export's per-collection folder/endpoint fetch is now parallelized (`Promise.all`)
  instead of two sequential round trips.
- `environmentsRepo.createEnvironment`/`createVariable` and `importExportRepo.createJob` now
  accept an optional `dbClient` (matching the existing `collectionsRepo` pattern) so callers can
  run them inside a caller-supplied transaction.
