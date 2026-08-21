# Client Integration Guide

This guide is the implementation reference for SDK/client engineers.

role-node exposes one public transport:

- REST (JSON/HTTP) for route-based integrations.

Source of truth:

- Runtime behavior: `src/modules/**`
- Verified examples copied from integration tests:
  - `tests/integration/auth.test.ts`
  - `tests/integration/workspaces.test.ts`
  - `tests/integration/app.test.ts`

## Base behavior

### REST transport

- Base URL: environment specific (for example `https://api.example.com`)
- JSON request header: `Content-Type: application/json`
- Auth header (protected routes): `Authorization: Bearer <accessToken>`
- Correlation header: every response includes `x-request-id`

### Success envelopes

All success responses use:

```json
{ "success": true, "data": ... }
```

Supported `data` shapes:

- Object: `{ ... }`
- List: `{ "items": [...] }`
- Cursor page: `{ "items": [...], "cursor": { "next": 12, "hasMore": true } }`
- Action confirmation: `{ "action": "deleted" }` (or `left`, `revoked`, `cancelled`)

### Error envelope

All errors use:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "details": {
      "fieldErrors": {
        "email": ["Invalid email address"]
      }
    },
    "requestId": "req_test"
  }
}
```

`error.requestId` always matches response header `x-request-id` (validated in `tests/integration/app.test.ts`).

## Authentication lifecycle

### 1) Register or login to obtain token pair

Example request (copied from `tests/integration/auth.test.ts`):

```json
{
  "name": "Altay",
  "email": "altay@example.com",
  "password": "password123",
  "accountType": "single"
}
```

Register/login/refresh return `data.tokens`:

- `accessToken`
- `refreshToken`
- `accessTokenTtlSeconds`
- `refreshTokenTtlSeconds`

### 2) Call protected endpoints with access token

Use:

```
Authorization: Bearer <accessToken>
```

### 3) Use refresh token rotation

When access token is expired or close to expiry, call:

`POST /api/auth/refresh`

Example request (copied from `tests/integration/auth.test.ts`):

```json
{ "refreshToken": "<previousRefreshToken>" }
```

### 4) Logout (session revoke)

`POST /api/auth/logout` with current refresh token revokes that session.

## Token refresh rules

Based on `src/modules/auth/service.ts`:

- Refresh token must be a valid JWT signed with refresh secret and `typ=refresh`.
- Refresh token must map to an active, non-revoked, non-expired session.
- On successful refresh, server revokes the old session and issues a new token pair.
- Old refresh token becomes invalid after rotation (verified in `tests/integration/auth.test.ts`).
- Logout revokes session when token is valid; invalid refresh token on logout is ignored (idempotent no-op).

Client behavior:

- Persist the latest refresh token after every successful refresh.
- Replace access token and refresh token atomically.
- If refresh fails with `401` (`INVALID_REFRESH_TOKEN` or `REFRESH_SESSION_INVALID`), clear auth state and force re-authentication.

## Pagination and cursor semantics

### List endpoints

Most list routes return:

```json
{
  "success": true,
  "data": {
    "items": []
  }
}
```

Examples validated in tests:

- collections list (`tests/integration/collections.test.ts`)
- environments list (`tests/integration/environments.test.ts`)
- import-export jobs list (`tests/integration/import-export.test.ts`)

### Cursor endpoint

`GET /api/workspaces/:workspaceId/updates?since=<number>&limit=<number>` uses cursor paging.

Request sequence copied from `tests/integration/workspaces.test.ts`:

1. First poll: `?since=0&limit=50`
2. Read `data.cursor.next`
3. Next poll with `?since=<next>&limit=50`

Response shape:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 101,
        "workspaceId": 1,
        "actorUserId": 1,
        "entity": "workspace_member",
        "action": "role_updated",
        "entityId": 2,
        "payload": null,
        "createdAt": "2026-01-01T10:00:00.000Z"
      }
    ],
    "cursor": {
      "next": 101,
      "hasMore": false
    }
  }
}
```

Cursor rules:

- `next` is the event id to reuse as the next `since` value.
- `hasMore` is true when current page reached requested `limit`.
- Polling can be implemented as: `since = cursor.next` until no immediate need, then wait and poll again.

## Common error codes for SDK handling

Use `error.code` for branching logic (not `error.message`).

| Code                      | HTTP | Typical handling                                     |
| ------------------------- | ---- | ---------------------------------------------------- |
| `VALIDATION_FAILED`       | 400  | Do not retry unchanged payload; surface field errors |
| `MISSING_ACCESS_TOKEN`    | 401  | Acquire/login, then retry once with token            |
| `INVALID_ACCESS_TOKEN`    | 401  | Attempt refresh; if refresh fails, force login       |
| `INVALID_REFRESH_TOKEN`   | 401  | Force login                                          |
| `REFRESH_SESSION_INVALID` | 401  | Force login                                          |
| `WORKSPACE_ACCESS_DENIED` | 403  | Do not retry; show permission state                  |
| `WORKSPACE_NOT_FOUND`     | 404  | Do not retry until resource selection changes        |

For complete registry see `docs/errors.md`.

## Retry recommendations

Default SDK strategy:

- `401 INVALID_ACCESS_TOKEN`: refresh once, then replay original request once.
- `500 INTERNAL_SERVER_ERROR`: retry cautiously (1-2 times) for idempotent operations.
- `400/403/404/409/410/422`: no automatic retry without user or payload changes.

Backoff example:

- attempt 1: immediate
- attempt 2: 300ms + jitter
- attempt 3: 900ms + jitter

## Rate, size, and time limits

### Rate limiting

- No built-in API rate limit is currently published.
- Apply client-side throttling and exponential backoff to protect upstreams.

## Fixture-backed request examples

These request payloads are copied from integration tests:

### Register (`tests/integration/auth.test.ts`)

```json
{
  "name": "Altay",
  "email": "altay@example.com",
  "password": "password123",
  "accountType": "single"
}
```

### Refresh (`tests/integration/auth.test.ts`)

```json
{ "refreshToken": "<token-from-register-or-login>" }
```

### Workspace updates cursor poll (`tests/integration/workspaces.test.ts`)

```json
{
  "firstPoll": "/api/workspaces/1/updates?since=0&limit=50",
  "secondPoll": "/api/workspaces/1/updates?since=<nextCursor>&limit=50"
}
```

## Implementation checklist (SDK/client)

- Parse success envelopes by `data` shape (`object`, `items`, `cursor`, `action`).
- Parse and propagate `x-request-id` for support/diagnostics.
- Branch on `error.code` instead of message text.
- Implement token rotation with atomic token replacement.
- Implement cursor polling with `since=cursor.next`.
- Add idempotency-aware retry policy with capped exponential backoff.
