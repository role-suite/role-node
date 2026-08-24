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
- Full per-endpoint reference (request/response shapes, validation rules, error codes) beyond
  what this guide covers:
  - `docs/modules/auth.md`
  - `docs/modules/workspaces.md`
  - `docs/modules/collections.md`
  - `docs/modules/environments.md`
  - `docs/modules/import-export.md`
  - This guide covers cross-cutting patterns (auth lifecycle, envelopes, errors, sync,
    pagination, limits); the module docs cover what each individual endpoint accepts/returns.

## Machine-readable spec

An OpenAPI 3.1 document is generated from the same Zod schemas the server validates against, so
it can't drift from runtime behavior the way hand-written docs can:

- `GET /docs/openapi.json` — the raw spec.
- `GET /docs` — the same spec rendered as an interactive Swagger UI, with a realistic example
  value on every request body and "Try it out" support against a real bearer token.
- **Only served when `NODE_ENV !== "production"`** (`src/app.ts`) — fetch/generate from a
  non-production environment, not from the live API.

This is the fastest path to a typed client: point an OpenAPI generator
(`openapi-generator-cli`, `swagger_dart_code_generator`/`openapi_generator` on pub.dev, etc.) at
the JSON to generate Dart models and a request client instead of hand-writing every DTO from
this guide's prose examples. Regenerate whenever `role-node` bumps a minor/major version (see
`docs/compatibility.md`).

### About `role-sdk` / `role-client`

`docs/compatibility.md` tracks version compatibility with two sibling repos, `role-sdk` and
`role-client`, but neither this repo nor its docs state what language/platform they target. If
you're building a new client (e.g. a Flutter/Dart app) and can't confirm those repos are
Dart-compatible, don't assume they're a starting point — treat `role-node` as a plain REST/JSON
API and either generate a client from `/docs/openapi.json` or hand-roll one against this guide
and the module docs above.

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
- Action confirmation with count (one endpoint only —
  `DELETE /api/v1/auth/sessions`): `{ "action": "revoked", "count": 3 }`

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

`POST /api/v1/auth/refresh`

Example request (copied from `tests/integration/auth.test.ts`):

```json
{ "refreshToken": "<previousRefreshToken>" }
```

### 4) Logout (session revoke)

`POST /api/v1/auth/logout` with current refresh token revokes that session.

### 5) Switch workspace

A token pair is scoped to one workspace (`data.workspace`). A user who belongs to more than
one workspace (see `data.memberships`) switches into another with:

`POST /api/v1/auth/switch-workspace`

Requires the current access token:

```
Authorization: Bearer <accessToken>
```

Request body:

```json
{ "workspaceId": 2 }
```

Returns the same `AuthResponse` shape as register/login/refresh, scoped to the new workspace.
The session backing the access token used to call this endpoint is revoked as part of the
switch — treat the response's `data.tokens` as a full replacement, exactly like a refresh.
Switching to a workspace the caller is not a member of returns
`403 WORKSPACE_ACCESS_DENIED`.

### 6) Session / device management

Every login/register/refresh/switch-workspace call creates a new session row. A user can list
and revoke their own sessions independently of the device that's currently calling the API —
useful for "sign out my other phone."

`GET /api/v1/auth/sessions` — list the caller's active (non-revoked, non-expired) sessions across
every workspace they've logged into:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 12,
        "workspaceId": 1,
        "workspaceName": "Altay's Workspace",
        "workspaceSlug": "altays-workspace",
        "createdAt": "2026-08-24T10:00:00.000Z",
        "expiresAt": "2026-08-31T10:00:00.000Z",
        "current": true
      }
    ]
  }
}
```

`current: true` marks the session backing the access token used for the request. Never
returned: `refreshTokenHash` or any other session secret.

`DELETE /api/v1/auth/sessions/:sessionId` — revoke one of the caller's own sessions by id. Returns
`404 AUTH_SESSION_NOT_FOUND` for an unknown id or a session belonging to another user.

`DELETE /api/v1/auth/sessions` — "sign out everywhere else": revokes every session for the caller
except the one backing the current request. Returns `{ "action": "revoked", "count": <n> }`.

Revoking a session blocks it from refreshing again, but does **not** invalidate an
already-issued access token before its natural (short) expiry — the same behavior as
`/api/v1/auth/logout`. Clients relying on remote sign-out should treat it as "this device stops
being able to refresh," not "this device is instantly logged out."

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

## Real-time sync

There is no push/websocket transport. `GET /api/v1/workspaces/:workspaceId/updates` cursor polling
(below) is the supported sync mechanism for every client platform for this phase — poll it on
an interval while the app is foregrounded/running; there is currently no server-initiated
notification when the app is backgrounded or closed. Every workspace mutation (collections,
folders, endpoints, examples, environments, variables, membership changes, and completed
import jobs) publishes a row to this feed, so a full poll cycle is sufficient to catch up
regardless of who made the change or from which device.

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

**These list routes are not paginated — `items` is the complete list, every call, with no
`limit`/`offset`/cursor.** Confirmed against the actual queries (`src/modules/*/repo.ts`): none
of the following endpoints have a `LIMIT` clause, so a large workspace returns everything in one
response:

- `GET /workspaces`, `GET /workspaces/:workspaceId/members`
- `GET /workspaces/:workspaceId/collections`, and the nested `endpoints`/`folders`/`examples`
  list routes under a collection
- `GET /workspaces/:workspaceId/environments`, and the nested `variables` list route
- `GET /workspaces/:workspaceId/import-export/jobs`

Only `GET /workspaces/:workspaceId/updates` (below) is cursor-paginated. Client implication: for
these unbounded lists, fetch once and cache/filter client-side rather than building
pagination UI around them — there's no server-side page to request. If a workspace ever grows
large enough for this to matter (hundreds of imported endpoints, for example), that's a backend
capacity question to raise, not something the client can work around with request parameters.

### Cursor endpoint

`GET /api/v1/workspaces/:workspaceId/updates?since=<number>&limit=<number>` uses cursor paging.

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

| Code                      | HTTP | Typical handling                                                                                     |
| ------------------------- | ---- | ---------------------------------------------------------------------------------------------------- |
| `VALIDATION_FAILED`       | 400  | Do not retry unchanged payload; surface field errors                                                 |
| `MISSING_ACCESS_TOKEN`    | 401  | Acquire/login, then retry once with token                                                            |
| `INVALID_ACCESS_TOKEN`    | 401  | Attempt refresh; if refresh fails, force login                                                       |
| `INVALID_REFRESH_TOKEN`   | 401  | Force login                                                                                          |
| `REFRESH_SESSION_INVALID` | 401  | Force login                                                                                          |
| `WORKSPACE_ACCESS_DENIED` | 403  | Do not retry; show permission state (also returned by `switch-workspace` for a non-member workspace) |
| `WORKSPACE_NOT_FOUND`     | 404  | Do not retry until resource selection changes                                                        |
| `AUTH_SESSION_NOT_FOUND`  | 404  | Session already gone/not the caller's; refresh the session list, don't retry the same id             |
| `RATE_LIMIT_EXCEEDED`     | 429  | Wait for `Retry-After` seconds, then retry                                                           |

For complete registry see `docs/errors.md`.

## Retry recommendations

Default SDK strategy:

- `401 INVALID_ACCESS_TOKEN`: refresh once, then replay original request once.
- `429 RATE_LIMIT_EXCEEDED`: wait for the `Retry-After` header value, then retry once.
- `500 INTERNAL_SERVER_ERROR`: retry cautiously (1-2 times) for idempotent operations. Exception:
  if the request had a large body, check it against the 1mb limit first (see "Request size
  limits") instead of retrying blindly.
- `400/403/404/409/410/422`: no automatic retry without user or payload changes.

Backoff example:

- attempt 1: immediate
- attempt 2: 300ms + jitter
- attempt 3: 900ms + jitter

## Rate, size, and time limits

### Rate limiting

Enforced by `src/shared/middleware/rate-limit.ts`, mounted at the `/api/v1/auth` and
`/api/v1/workspaces` routers (so it covers every endpoint in this API, including collections,
environments, and import-export, which are nested under `/api/v1/workspaces`):

- **General limit**: `RATE_LIMIT_MAX` requests per `RATE_LIMIT_WINDOW_MS` window, default
  **300 requests / 60s**, applied to every request.
- **Auth limit**: `AUTH_RATE_LIMIT_MAX` requests per `AUTH_RATE_LIMIT_WINDOW_MS` window, default
  **10 requests / 60s**, applied _in addition_ to the general limit, and only on
  `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, and `POST /api/v1/auth/refresh`. `/logout`,
  `/switch-workspace`, `/sessions*`, and `/me` are only subject to the general limit.
- Limits are keyed by client IP (`express-rate-limit` default), not by user or token.
- Both limits are disabled in the server's own `test` environment; expect them to be enforced in
  every other environment.

On every response, expect the `RateLimit-Policy` and `RateLimit` response headers (draft-7
format, e.g. `RateLimit: limit=300, remaining=299, reset=60`), where `reset` is seconds until
the window resets, not an epoch timestamp. Deprecated `X-RateLimit-*` headers are not sent.

When a limit is exceeded, the response is:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "details": {},
    "requestId": "..."
  }
}
```

Client behavior:

- Read `Retry-After` (seconds) and wait at least that long before retrying.
- Apply client-side throttling and exponential backoff in addition to respecting `Retry-After`,
  to avoid tripping the limit in the first place — this matters more for a mobile/desktop client
  polling `GET /api/v1/workspaces/:workspaceId/updates` than it does for one-off requests.

### Request size limits

- JSON request bodies are capped by `REQUEST_BODY_LIMIT`, default **1mb**
  (`express.json({ limit: ... })` in `src/app.ts`).
- **Known rough edge**: exceeding this limit currently surfaces as `500 INTERNAL_SERVER_ERROR`,
  not a clean `413`, because the error handler (`src/shared/errors/error-handler.ts`) only
  special-cases `ZodError` and the app's own `AppError` — a raw body-parser `PayloadTooLargeError`
  falls through to the generic 500 branch. Treat an unexpected `500` on a payload-heavy request
  (e.g. a large import-export import) as a signal to check payload size against 1mb before
  assuming a server bug.

### Time limits

- **Access token TTL**: `AUTH_ACCESS_TOKEN_TTL_SECONDS`, default **900s (15 min)**.
- **Refresh token TTL**: `AUTH_REFRESH_TOKEN_TTL_SECONDS`, default **604800s (7 days)**. A
  refresh token unused for longer than this can no longer be refreshed — the session's
  `expires_at` will have passed, returning `401 REFRESH_SESSION_INVALID`.
- **Server request timeout**: `SERVER_REQUEST_TIMEOUT_MS`, default **300000ms (5 min)** — the
  max time Node's HTTP server allows to receive a full request. Relevant mainly to large
  import/export payloads sent over a slow connection.

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
  "firstPoll": "/api/v1/workspaces/1/updates?since=0&limit=50",
  "secondPoll": "/api/v1/workspaces/1/updates?since=<nextCursor>&limit=50"
}
```

### Switch workspace (`tests/integration/auth.test.ts`)

```json
{ "workspaceId": 2 }
```

### Revoke a session (`tests/integration/auth.test.ts`)

```json
{
  "method": "DELETE",
  "url": "/api/v1/auth/sessions/<sessionId>"
}
```

## Implementation checklist (SDK/client)

- Parse success envelopes by `data` shape (`object`, `items`, `cursor`, `action`, and the one
  `action` + `count` case from bulk session revoke).
- Parse and propagate `x-request-id` for support/diagnostics.
- Branch on `error.code` instead of message text.
- Implement token rotation with atomic token replacement.
- Implement cursor polling with `since=cursor.next`.
- Add idempotency-aware retry policy with capped exponential backoff.
- Handle `429 RATE_LIMIT_EXCEEDED` by waiting for `Retry-After` before retrying.
- Surface session list/revoke (`GET /api/v1/auth/sessions`, `DELETE /api/v1/auth/sessions[/:id]`) if
  the client offers a "manage devices" or "sign out everywhere" UI.
