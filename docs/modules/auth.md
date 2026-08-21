# Auth Module

This module implements authentication for a workspace-aware system.

Base route: `/api/auth`

## What this module does

- Registers users with either a personal workspace (`single`) or team workspace (`team`).
- Authenticates users with email/password.
- Issues short-lived access tokens and long-lived refresh tokens.
- Rotates refresh sessions on token refresh.
- Revokes sessions on logout.
- Returns the authenticated profile and workspace context for `/me`.
- Enforces workspace membership when resolving auth context.

## Module files

- `src/modules/auth/route.ts`: Route definitions.
- `src/modules/auth/controller.ts`: Request parsing/validation and HTTP responses.
- `src/modules/auth/schema.ts`: Zod input schemas.
- `src/modules/auth/service.ts`: Business logic.
- `src/modules/auth/repo.ts`: Database reads/writes for users, workspaces, memberships, sessions.
- `src/shared/middleware/require-auth.ts`: Access token verification + context hydration.

## API endpoints

### `POST /api/auth/register`

Creates a user account, creates a workspace, and creates an owner membership in a single DB
transaction, then returns an auth payload with a token pair. If any of the three inserts fail,
the whole registration rolls back — there is no path to an orphaned user without a workspace.

Request body:

```json
{
  "name": "Altay",
  "email": "altay@example.com",
  "password": "password123",
  "accountType": "single"
}
```

Team account example:

```json
{
  "name": "Altay",
  "email": "altay@example.com",
  "password": "password123",
  "accountType": "team",
  "teamName": "Core Team"
}
```

Validation rules:

- `name`: string, trimmed, min 2, max 120
- `email`: valid email, lowercased before it's checked/stored (case-insensitive)
- `password`: string, min 8, max 128 (the cap bounds argon2 hashing cost per request, not an
  algorithm limit)
- `accountType`: `single` or `team`
- `teamName`: required when `accountType` is `team`, min 2, max 120 (enforced at the type level
  via a discriminated union on `accountType`, not a runtime-only refinement)

Success:

- `201 Created`
- Response shape: `{ success: true, data: AuthResponse }`

Domain errors:

- `409`: `Email already in use`

### `POST /api/auth/login`

Authenticates credentials and issues a new token pair.

Request body:

```json
{
  "email": "altay@example.com",
  "password": "password123"
}
```

Notes:

- `email` is lowercased before lookup (case-insensitive, same as register).
- `workspaceId` is not accepted on login payload.
- Login uses the earliest-created membership (lowest membership id) as active workspace context.
  There is no explicit "default workspace" flag on a membership.

Success:

- `200 OK`
- Response shape: `{ success: true, data: AuthResponse }`

Domain errors:

- `401`: `Invalid credentials`
- `403`: `No workspace membership found`
- `404`: `Workspace not found`

### `POST /api/auth/refresh`

Validates refresh token, validates current session record, revokes old session, and issues a new token pair.

Request body:

```json
{
  "refreshToken": "<token>"
}
```

Success:

- `200 OK`
- Response shape: `{ success: true, data: AuthResponse }`

Domain errors:

- `401`: `Invalid refresh token`
- `401`: `Refresh session is invalid`

### `POST /api/auth/logout`

Revokes the session referenced by the provided refresh token.

Request body:

```json
{
  "refreshToken": "<token>"
}
```

Success:

- `200 OK`
- Response shape: `{ success: true, data: { loggedOut: true } }`

Notes:

- Invalid/expired refresh token is treated as a no-op and still returns success.

### `GET /api/auth/me`

Returns authenticated user + workspace + memberships.

Headers:

- `Authorization: Bearer <access-token>`

Success:

- `200 OK`
- Response shape: `{ success: true, data: Omit<AuthResponse, "tokens"> }`

Domain errors:

- `401`: `Missing access token`
- `401`: `Invalid access token`
- `401`: `Authenticated context is invalid`

## Response model

`AuthResponse` returned from register/login/refresh:

- `user`: `{ id, name, email }`
- `workspace`: `{ id, _id, name, slug, type, role }`
- `memberships`: list of `{ workspaceId, _id, name, slug, type, role }` for the user
- `tokens`: `{ accessToken, refreshToken, accessTokenTtlSeconds, refreshTokenTtlSeconds }`

`_id` duplicates `id`/`workspaceId` for legacy Mongo-style API clients; new consumers should use
the plain numeric field.

All responses use shared envelope from `src/shared/app-response.ts`:

- success: `{ success: true, data: ... }`
- error: `{ success: false, message, data? }`

## Auth and session lifecycle

1. Register creates the user, workspace, and owner membership inside one DB transaction
   (`authRepo.withAuthTransaction`), then picks that workspace as active context. Login picks
   active workspace context per the rule above.
2. Service creates an `auth_sessions` row first with expiry.
3. Access + refresh tokens are signed with payload fields:
   - `sub` user id
   - `wid` workspace id
   - `sid` session id
   - `typ` token type (`access` or `refresh`)
     Access and refresh tokens are signed concurrently (`Promise.all`), not sequentially.
4. Refresh token hash is persisted in session (`sha256`) and plaintext token is returned only to client.
5. Refresh validates token signature/type/expiry and compares hashed token to persisted `refresh_token_hash`.
6. On successful refresh, old session is revoked and a new session/token pair is issued (rotation).
   User/workspace/role for the new response are resolved via `authRepo.findAuthContext`, a single
   joined query, instead of three separate lookups.
7. Logout revokes session by `sid` from refresh token.

## Workspace-aware authorization model

This auth module is intentionally workspace-aware.

- User identity alone is not enough.
- Active auth context is `(userId, workspaceId, role, sessionId)`.
- Access middleware (`requireAuth`) validates token and ensures, via a single
  `authRepo.findAuthContext` join query:
  - user exists
  - workspace exists
  - membership exists between user and workspace

This is why `auth.repo.ts` contains workspace and membership functions in addition to user/session functions.

## Persistence model

Tables used:

- `auth_users`
- `workspaces`
- `workspace_memberships`
- `auth_sessions`
- `workspace_events`
- `workspace_invitations`

The last two exist because the `workspaces` module has no `repo.ts` of its own and reuses
`auth/repo.ts` for all workspace/event/invitation persistence.

Migration files:

- `migrations/20260320_001_create_auth_tables.migration.ts`
- `migrations/20260328_005_create_workspace_events_table.migration.ts`
- `migrations/20260407_006_create_workspace_invitations_table.migration.ts`

Postgres persistence details in repo implementation:

- Parameter placeholders use `$1...`.
- Inserts use `RETURNING`.
- `clear()` uses `TRUNCATE ... RESTART IDENTITY`.

## Security choices

- Password hashing uses Argon2id (`src/shared/auth/password.ts`).
- Token comparison uses constant-time comparisons where applicable.
- Refresh tokens are stored hashed (`sha256`), not in plaintext.
- Refresh rotation invalidates previous refresh session after use.
- Access token middleware re-hydrates DB context to reject stale/deleted memberships.
- Email is lowercased at the schema level, so lookups, the DB unique constraint, and login are
  all case-insensitive.
- User/workspace/membership creation on register is atomic (single DB transaction); a failure
  partway through cannot leave a user without a workspace.

## Environment variables used by this module

- `AUTH_ACCESS_TOKEN_SECRET`
- `AUTH_REFRESH_TOKEN_SECRET`
- `AUTH_ACCESS_TOKEN_TTL_SECONDS`
- `AUTH_REFRESH_TOKEN_TTL_SECONDS`
- Plus DB variables used by shared DB config (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, pool/SSL settings)

Defined in `src/config/env.ts`.

## Testing strategy

Current tests:

- `tests/unit/auth.schema.test.ts`
- `tests/unit/auth.repo.test.ts`
- `tests/unit/auth.service.test.ts`
- `tests/integration/auth.test.ts`

Auth tests use an in-memory DB test double via:

- `setAuthRepoDbClient(...)` from `src/modules/auth/repo.ts`
- `tests/helpers/auth-test-db.ts`

This keeps auth tests deterministic and independent from external DB availability while preserving repository behavior.
