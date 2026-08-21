# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## Unreleased

### Changed

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
