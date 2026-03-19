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

- `src/modules/auth/auth.route.ts`: Route definitions.
- `src/modules/auth/auth.controller.ts`: Request parsing/validation and HTTP responses.
- `src/modules/auth/auth.schema.ts`: Zod input schemas.
- `src/modules/auth/auth.service.ts`: Business logic.
- `src/modules/auth/auth.repo.ts`: Database reads/writes for users, workspaces, memberships, sessions.
- `src/shared/middleware/require-auth.ts`: Access token verification + context hydration.

## API endpoints

### `POST /api/auth/register`

Creates a user account, creates a workspace, creates owner membership, and returns auth payload with token pair.

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
- `email`: valid email
- `password`: string, min 8, max 72
- `accountType`: `single` or `team`
- `teamName`: required when `accountType` is `team`, min 2, max 120

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

- `workspaceId` is not accepted on login payload.
- Login uses the first available membership as active workspace context.

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
- `workspace`: `{ id, name, slug, type, role }`
- `memberships`: list of workspace memberships for user
- `tokens`: `{ accessToken, refreshToken, accessTokenTtlSeconds, refreshTokenTtlSeconds }`

All responses use shared envelope from `src/shared/app-response.ts`:

- success: `{ success: true, data: ... }`
- error: `{ success: false, message, data? }`

## Auth and session lifecycle

1. Register/Login picks active workspace context.
2. Service creates an `auth_sessions` row first with expiry.
3. Access + refresh tokens are signed with payload fields:
   - `sub` user id
   - `wid` workspace id
   - `sid` session id
   - `typ` token type (`access` or `refresh`)
4. Refresh token hash is persisted in session (`sha256`) and plaintext token is returned only to client.
5. Refresh validates token signature/type/expiry and compares hashed token to persisted `refresh_token_hash`.
6. On successful refresh, old session is revoked and a new session/token pair is issued (rotation).
7. Logout revokes session by `sid` from refresh token.

## Workspace-aware authorization model

This auth module is intentionally workspace-aware.

- User identity alone is not enough.
- Active auth context is `(userId, workspaceId, role, sessionId)`.
- Access middleware (`requireAuth`) validates token and ensures:
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

Migration file:

- `migrations/20260320_001_create_auth_tables.migration.ts`

Dialect support details in repo implementation:

- Parameter placeholders: `$1...` for Postgres, `?` for MySQL/MariaDB
- `RETURNING` path for Postgres inserts
- Insert-then-select path for MySQL/MariaDB inserts
- `clear()` uses `TRUNCATE ... RESTART IDENTITY` on Postgres and `DELETE + AUTO_INCREMENT reset` on MySQL/MariaDB

## Security choices

- Password hashing uses `scrypt` with random salt (`src/shared/auth/password.ts`).
- Token comparison uses constant-time comparisons where applicable.
- Refresh tokens are stored hashed (`sha256`), not in plaintext.
- Refresh rotation invalidates previous refresh session after use.
- Access token middleware re-hydrates DB context to reject stale/deleted memberships.

## Environment variables used by this module

- `AUTH_ACCESS_TOKEN_SECRET`
- `AUTH_REFRESH_TOKEN_SECRET`
- `AUTH_ACCESS_TOKEN_TTL_SECONDS`
- `AUTH_REFRESH_TOKEN_TTL_SECONDS`
- Plus DB variables used by shared DB config (`DB_DIALECT`, `DATABASE_URL`, pool/SSL settings)

Defined in `src/config/env.ts`.

## Testing strategy

Current tests:

- `tests/unit/auth.schema.test.ts`
- `tests/unit/auth.repo.test.ts`
- `tests/unit/auth.service.test.ts`
- `tests/integration/auth.test.ts`

Auth tests use an in-memory DB test double via:

- `setAuthRepoDbClient(...)` from `src/modules/auth/auth.repo.ts`
- `tests/helpers/auth-test-db.ts`

This keeps auth tests deterministic and independent from external DB availability while preserving the repository contract.
