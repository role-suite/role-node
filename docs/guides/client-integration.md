# Client Integration Guide

This guide explains how to integrate a client application with this backend. It covers base setup, authentication, workspace flows, and endpoint request/response examples including error semantics.

## Base URL and headers

- Base URL: configure in your client (example: `https://api.example.com`)
- JSON requests: send `Content-Type: application/json`
- Authenticated routes: send `Authorization: Bearer <accessToken>`

All API responses follow the envelope:

```json
{
  "success": true,
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Human-readable error"
}
```

Timestamps are ISO strings in responses.

## Health

`GET /health`

Response:

```json
{ "success": true, "data": { "status": "ok" } }
```

## Health

`GET /health`

Response:

```json
{ "success": true, "data": { "status": "ok" } }
```

## Authentication flow

### Register

`POST /api/auth/register`

Request:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123",
  "accountType": "single"
}
```

Team account variant:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123",
  "accountType": "team",
  "teamName": "Ada Team"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "Ada Lovelace", "email": "ada@example.com" },
    "workspace": {
      "id": 1,
      "_id": 1,
      "name": "Ada's Workspace",
      "slug": "adas-workspace",
      "type": "personal",
      "role": "owner"
    },
    "memberships": [
      {
        "workspaceId": 1,
        "_id": 1,
        "name": "Ada's Workspace",
        "slug": "adas-workspace",
        "type": "personal",
        "role": "owner"
      }
    ],
    "tokens": {
      "accessToken": "<jwt>",
      "refreshToken": "<jwt>",
      "accessTokenTtlSeconds": 3600,
      "refreshTokenTtlSeconds": 1209600
    }
  }
}
```

Errors:

- `409` Email already in use
- `400` Validation errors (missing fields or invalid formats)

### Login

`POST /api/auth/login`

Request:

```json
{ "email": "ada@example.com", "password": "password123" }
```

Response matches register (tokens + workspace + memberships).

Errors:

- `401` Invalid credentials

### Refresh token

`POST /api/auth/refresh`

Request:

```json
{ "refreshToken": "<jwt>" }
```

Response matches login with a new token pair.

Errors:

- `401` Invalid refresh token

### Logout

`POST /api/auth/logout`

Request:

```json
{ "refreshToken": "<jwt>" }
```

Success response:

```json
{ "success": true, "data": { "revoked": true } }
```

### Current user

`GET /api/auth/me`

Response includes user + workspace + memberships (no tokens).

Errors:

- `401` Missing or invalid access token

## Workspace flow

### List workspaces

`GET /api/workspaces`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "_id": 1,
      "name": "Ada's Workspace",
      "slug": "adas-workspace",
      "type": "personal",
      "role": "owner"
    }
  ]
}
```

### Get workspace by id

`GET /api/workspaces/:workspaceId`

Errors:

- `403` Workspace access denied
- `404` Workspace not found

### Create team workspace

`POST /api/workspaces`

Request:

```json
{ "name": "Platform Team" }
```

Creates a team workspace and returns summary.

Errors:

- `400` Invalid name

### Members list

`GET /api/workspaces/:workspaceId/members`

Response:

```json
{
  "success": true,
  "data": [
    { "userId": 1, "name": "Ada", "email": "ada@example.com", "role": "owner" }
  ]
}
```

### Add member directly

`POST /api/workspaces/:workspaceId/members`

Request:

```json
{ "email": "member@example.com", "role": "member" }
```

Rules and errors:

- `403` Only workspace owners can manage members
- `400` Personal workspaces do not support additional members
- `404` User not found
- `409` User is already a workspace member

### Update member role

`PATCH /api/workspaces/:workspaceId/members/:memberUserId`

Request:

```json
{ "role": "admin" }
```

Errors:

- `403` Only workspace owners can manage members
- `400` Owner role cannot be changed
- `404` Workspace member not found

### Remove member

`DELETE /api/workspaces/:workspaceId/members/:memberUserId`

Errors:

- `403` Only workspace owners can manage members
- `400` Use leave endpoint to remove yourself
- `400` Cannot remove the last workspace owner
- `404` Workspace member not found

### Leave workspace

`POST /api/workspaces/:workspaceId/leave`

Errors:

- `400` Cannot leave as the last workspace owner

## Invitation-based join flow

### Create invitation (owner only)

`POST /api/workspaces/:workspaceId/invitations`

Request:

```json
{ "email": "invitee@example.com", "role": "member" }
```

Response includes a plaintext token:

```json
{
  "success": true,
  "data": {
    "id": 10,
    "workspaceId": 2,
    "email": "invitee@example.com",
    "role": "member",
    "token": "<invite-token>",
    "expiresAt": "2026-04-14T10:00:00.000Z"
  }
}
```

Errors:

- `400` Personal workspaces do not support invitations
- `403` Only workspace owners can manage members
- `409` Invitation already pending
- `409` User is already a workspace member
- `404` Workspace not found

### Accept invitation

`POST /api/workspaces/join`

Request:

```json
{ "token": "<invite-token>" }
```

Response: workspace summary for the new membership.

Errors:

- `404` Invitation not found
- `409` Invitation already used
- `410` Invitation expired
- `403` Invitation email does not match user
- `400` Workspace does not accept members
- `409` User is already a workspace member

## Convert personal workspace to team

`POST /api/workspaces/:workspaceId/convert-to-team`

Request (optional rename):

```json
{ "name": "My Team" }
```

Errors:

- `403` Only workspace owners can manage members
- `400` Workspace is already a team
- `404` Workspace not found

## Workspace updates feed

`GET /api/workspaces/:workspaceId/updates?since=0&limit=50`

Response:

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 12,
        "workspaceId": 2,
        "actorUserId": 1,
        "entity": "workspace_member",
        "action": "added",
        "entityId": 4,
        "payload": { "userId": 4, "role": "member" },
        "createdAt": "2026-04-07T12:00:00.000Z"
      }
    ],
    "cursor": { "since": 0, "next": 12 }
  }
}
```

## Collections

All collection endpoints are scoped under `/api/workspaces/:workspaceId`.

Shared shapes:

```json
{ "key": "Header-Name", "value": "value", "enabled": true }
```

```json
{ "type": "none" }
```

```json
{ "type": "bearer", "token": "<token>" }
```

```json
{ "type": "basic", "username": "user", "password": "pass" }
```

Body variants:

```json
{ "mode": "none" }
```

```json
{ "mode": "raw", "contentType": "application/json", "raw": "{}" }
```

```json
{ "mode": "urlencoded", "entries": [{ "key": "a", "value": "1" }] }
```

```json
{
  "mode": "formdata",
  "entries": [{ "type": "text", "key": "a", "value": "1" }]
}
```

```json
{
  "mode": "formdata",
  "entries": [
    {
      "type": "file",
      "key": "file",
      "fileName": "a.txt",
      "dataBase64": "<base64>",
      "contentType": "text/plain"
    }
  ]
}
```

```json
{
  "mode": "binary",
  "fileName": "a.bin",
  "dataBase64": "<base64>",
  "contentType": "application/octet-stream"
}
```

### List collections

`GET /api/workspaces/:workspaceId/collections`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "_id": 1,
      "workspaceId": 1,
      "name": "Core",
      "description": null,
      "createdByUserId": 1,
      "createdAt": "2026-04-07T12:00:00.000Z",
      "updatedAt": "2026-04-07T12:00:00.000Z"
    }
  ]
}
```

### Get collection

`GET /api/workspaces/:workspaceId/collections/:collectionId`

Response: collection summary (same shape as list).

### Create collection

`POST /api/workspaces/:workspaceId/collections`

Request:

```json
{ "name": "Core", "description": "API calls" }
```

Response: collection summary.

### Update collection

`PATCH /api/workspaces/:workspaceId/collections/:collectionId`

Request (at least one field):

```json
{ "name": "Core", "description": null }
```

Response: updated collection summary.

### Delete collection

`DELETE /api/workspaces/:workspaceId/collections/:collectionId`

Response:

```json
{ "success": true, "data": { "deleted": true } }
```

### List endpoints in a collection

`GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints`

Response:

```json
{ "success": true, "data": [<endpoint>] }
```

Endpoint shape:

```json
{
  "id": 10,
  "collectionId": 1,
  "folderId": null,
  "name": "List users",
  "method": "GET",
  "url": "https://api.example.com/users",
  "headers": [{ "key": "Accept", "value": "application/json" }],
  "queryParams": [{ "key": "page", "value": "1" }],
  "body": { "mode": "none" },
  "auth": { "type": "none" },
  "position": 1,
  "createdByUserId": 1,
  "createdAt": "2026-04-07T12:00:00.000Z",
  "updatedAt": "2026-04-07T12:00:00.000Z"
}
```

### Get endpoint

`GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`

Response: endpoint summary (same shape as list).

### Create endpoint

`POST /api/workspaces/:workspaceId/collections/:collectionId/endpoints`

Request (example):

```json
{
  "folderId": null,
  "name": "List users",
  "method": "GET",
  "url": "https://api.example.com/users",
  "headers": [],
  "queryParams": [],
  "body": { "mode": "none" },
  "auth": { "type": "none" },
  "position": 1
}
```

Response: endpoint summary.

### Update endpoint

`PATCH /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`

Request (at least one field):

```json
{ "name": "List users", "url": "https://api.example.com/users" }
```

Response: updated endpoint summary.

### Delete endpoint

`DELETE /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`

Response:

```json
{ "success": true, "data": { "deleted": true } }
```

### List endpoint examples

`GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`

Response:

```json
{ "success": true, "data": [<example>] }
```

Example shape:

```json
{
  "id": 22,
  "endpointId": 10,
  "name": "Success",
  "statusCode": 200,
  "headers": [],
  "body": "{\"ok\":true}",
  "position": 0,
  "createdByUserId": 1,
  "createdAt": "2026-04-07T12:00:00.000Z",
  "updatedAt": "2026-04-07T12:00:00.000Z"
}
```

### Create endpoint example

`POST /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`

Request (example):

```json
{ "name": "Success", "statusCode": 200, "headers": [], "body": "{\"ok\":true}" }
```

Response: example summary.

### Update endpoint example

`PATCH /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`

Request (at least one field):

```json
{ "name": "Success (cached)" }
```

Response: updated example summary.

### Delete endpoint example

`DELETE /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`

Response:

```json
{ "success": true, "data": { "deleted": true } }
```

### List folders

`GET /api/workspaces/:workspaceId/collections/:collectionId/folders`

Response:

```json
{ "success": true, "data": [<folder>] }
```

Folder shape:

```json
{
  "id": 9,
  "collectionId": 1,
  "parentFolderId": null,
  "name": "Auth",
  "position": 0,
  "createdByUserId": 1,
  "createdAt": "2026-04-07T12:00:00.000Z",
  "updatedAt": "2026-04-07T12:00:00.000Z"
}
```

### Create folder

`POST /api/workspaces/:workspaceId/collections/:collectionId/folders`

Request:

```json
{ "name": "Auth", "parentFolderId": null, "position": 0 }
```

Response: folder summary.

### Update folder

`PATCH /api/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`

Request (at least one field):

```json
{ "name": "Auth v2" }
```

Response: updated folder summary.

### Delete folder

`DELETE /api/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`

Response:

```json
{ "success": true, "data": { "deleted": true } }
```

Common collection errors:

- `401` Missing or invalid access token
- `403` Workspace access denied
- `403` Only workspace owners and admins can modify collections
- `404` Collection not found
- `404` Collection folder not found

## Environments

All environment endpoints are scoped under `/api/workspaces/:workspaceId`.

### List environments

`GET /api/workspaces/:workspaceId/environments`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "workspaceId": 1,
      "name": "Staging",
      "createdByUserId": 1,
      "createdAt": "2026-04-07T12:00:00.000Z",
      "updatedAt": "2026-04-07T12:00:00.000Z"
    }
  ]
}
```

### Get environment

`GET /api/workspaces/:workspaceId/environments/:environmentId`

Response: environment summary (same shape as list).

### Create environment

`POST /api/workspaces/:workspaceId/environments`

Request:

```json
{ "name": "Staging" }
```

Response: environment summary.

### Update environment

`PATCH /api/workspaces/:workspaceId/environments/:environmentId`

Request:

```json
{ "name": "Prod" }
```

Response: updated environment summary.

### Delete environment

`DELETE /api/workspaces/:workspaceId/environments/:environmentId`

Response:

```json
{ "success": true, "data": { "deleted": true } }
```

### List variables

`GET /api/workspaces/:workspaceId/environments/:environmentId/variables`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "environmentId": 1,
      "key": "API_KEY",
      "value": "secret",
      "enabled": true,
      "isSecret": true,
      "position": 0,
      "createdByUserId": 1,
      "createdAt": "2026-04-07T12:00:00.000Z",
      "updatedAt": "2026-04-07T12:00:00.000Z"
    }
  ]
}
```

### Get variable

`GET /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`

Response: variable summary (same shape as list).

### Create variable

`POST /api/workspaces/:workspaceId/environments/:environmentId/variables`

Request:

```json
{
  "key": "API_KEY",
  "value": "secret",
  "enabled": true,
  "isSecret": true,
  "position": 0
}
```

Response: variable summary.

### Update variable

`PATCH /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`

Request (at least one field):

```json
{ "value": "new" }
```

Response: updated variable summary.

### Delete variable

`DELETE /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`

Response:

```json
{ "success": true, "data": { "deleted": true } }
```

Common environment errors:

- `401` Missing or invalid access token
- `403` Workspace access denied
- `403` Only workspace owners and admins can modify environments
- `404` Environment not found
- `404` Environment variable not found
- `409` Environment name already exists
- `409` Environment variable key already exists

## Runs

All run endpoints are scoped under `/api/workspaces/:workspaceId`.

### Create run

`POST /api/workspaces/:workspaceId/runs`

Request (adhoc example):

```json
{
  "source": {
    "type": "adhoc",
    "request": {
      "method": "GET",
      "url": "https://api.example.com/health",
      "headers": [],
      "queryParams": [],
      "body": { "mode": "none" },
      "auth": { "type": "none" }
    }
  },
  "environmentId": 1,
  "variableOverrides": [
    { "key": "BASE_URL", "value": "https://api.example.com" }
  ],
  "options": {
    "timeoutMs": 30000,
    "followRedirects": true,
    "maxResponseBytes": 1000000
  }
}
```

Request (collection endpoint example):

```json
{
  "source": {
    "type": "collectionEndpoint",
    "collectionId": 1,
    "endpointId": 10
  }
}
```

Response (ExecuteRunResult):

```json
{
  "success": true,
  "data": {
    "runId": 1,
    "status": "completed",
    "startedAt": "2026-04-07T12:00:00.000Z",
    "completedAt": "2026-04-07T12:00:00.500Z",
    "durationMs": 500,
    "request": {
      "method": "GET",
      "url": "https://api.example.com/health",
      "headers": [],
      "queryParams": [],
      "body": null,
      "auth": { "type": "none" },
      "resolvedVariables": {},
      "timeoutMs": 30000
    },
    "response": {
      "status": 200,
      "headers": { "content-type": "application/json" },
      "body": "{\"status\":\"ok\"}",
      "bodyBase64": null,
      "truncated": false,
      "sizeBytes": 18
    },
    "error": null
  }
}
```

### Get run

`GET /api/workspaces/:workspaceId/runs/:runId`

Response: ExecuteRunResult (same shape as create).

### Cancel run

`POST /api/workspaces/:workspaceId/runs/:runId/cancel`

Response: ExecuteRunResult (status becomes `cancelled`).

Common run errors:

- `400` Run validation failed
- `401` Missing or invalid access token
- `403` Workspace access denied
- `404` Run not found
- `404` Run source not found
- `408` Run timeout
- `409` Run cancelled
- `413` Response too large
- `422` Run policy blocked
- `502` Network error

## Import/Export

All import/export endpoints are scoped under `/api/workspaces/:workspaceId`.

### List jobs

`GET /api/workspaces/:workspaceId/import-export/jobs`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "workspaceId": 1,
      "type": "export",
      "status": "completed",
      "format": "json",
      "summary": {
        "includeCollections": true,
        "includeEnvironments": true,
        "includeRuns": false
      },
      "createdByUserId": 1,
      "createdAt": "2026-04-07T12:00:00.000Z",
      "completedAt": "2026-04-07T12:00:00.000Z"
    }
  ]
}
```

### Get job by id

`GET /api/workspaces/:workspaceId/import-export/jobs/:jobId`

Response: job summary (same shape as list).

### Create export job

`POST /api/workspaces/:workspaceId/import-export/exports`

Request:

```json
{
  "format": "json",
  "includeCollections": true,
  "includeEnvironments": true,
  "includeRuns": false
}
```

Response: job summary.

### Create import job

`POST /api/workspaces/:workspaceId/import-export/imports`

Request:

```json
{ "format": "json", "payload": { "collections": [], "environments": [] } }
```

Response: job summary with `summary.rootKeys` and `summary.rootKeyCount`.

Common import/export errors:

- `401` Missing or invalid access token
- `403` Workspace access denied
- `403` Only workspace owners and admins can run imports and exports
- `404` Import/export job not found

## Error code meanings

- `400` Invalid input or action not allowed for the resource state
- `401` Missing or invalid authentication
- `403` Authenticated but not permitted
- `404` Resource not found (or membership missing)
- `409` Conflict (already exists, already used, or duplicate)
- `410` Resource expired (invitation token)
- `500` Unexpected server error

## Recommended client behavior

- Store tokens securely; use `accessToken` for API calls.
- On `401`, prompt re-authentication or use refresh token flow.
- On `403`, hide actions for non-owners and non-members.
- On `409`/`410`, show actionable messaging (invite already used/expired).
- Keep workspace list and active workspace in client state and refresh after joins or conversions.
