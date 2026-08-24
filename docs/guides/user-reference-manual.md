# User Reference Manual

This is the full reference manual for using the current backend API.

This document focuses on REST endpoint usage.

It is intended for frontend developers, API integrators, and QA automation engineers.

## Base URL and format

- Local default base URL: `http://localhost:3000`
- All endpoints return JSON
- Response envelope:
  - success: `{ "success": true, "data": ... }`
  - error: `{ "success": false, "message": "...", "data"?: ... }`

## Authentication model

Most routes require:

```txt
Authorization: Bearer <accessToken>
```

Access tokens are workspace-context-aware. If the authenticated context is invalid (missing user/workspace/membership), API returns `401`.

## Auth API

### `POST /api/v1/auth/register`

Creates user + initial workspace + token pair.

Request:

```json
{
  "name": "Alice Example",
  "email": "alice@example.com",
  "password": "password123",
  "accountType": "single"
}
```

For team account:

```json
{
  "name": "Alice Example",
  "email": "alice@example.com",
  "password": "password123",
  "accountType": "team",
  "teamName": "Platform Team"
}
```

### `POST /api/v1/auth/login`

Request:

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### `POST /api/v1/auth/refresh`

Request:

```json
{
  "refreshToken": "<refresh-token>"
}
```

### `POST /api/v1/auth/logout`

Request:

```json
{
  "refreshToken": "<refresh-token>"
}
```

### `GET /api/v1/auth/me`

Returns current user, active workspace context, and memberships.

## Workspace API

### `GET /api/v1/workspaces`

List workspaces where user is a member.

### `POST /api/v1/workspaces`

Create new team workspace.

Request:

```json
{ "name": "API Team" }
```

### `GET /api/v1/workspaces/:workspaceId`

Get single workspace summary for authenticated member.

### Members

- `GET /api/v1/workspaces/:workspaceId/members`
- `POST /api/v1/workspaces/:workspaceId/members`
- `PATCH /api/v1/workspaces/:workspaceId/members/:memberUserId`
- `DELETE /api/v1/workspaces/:workspaceId/members/:memberUserId`
- `POST /api/v1/workspaces/:workspaceId/leave`

Add member request:

```json
{
  "email": "member@example.com",
  "role": "member"
}
```

Update role request:

```json
{ "role": "admin" }
```

## Collections API

### Collection CRUD

- `GET /api/v1/workspaces/:workspaceId/collections`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId`
- `POST /api/v1/workspaces/:workspaceId/collections`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId`

Create request:

```json
{
  "name": "Orders API",
  "description": "Endpoints for order processing"
}
```

### Collection folders

- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/folders`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/folders`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`

Create folder request:

```json
{
  "name": "Orders",
  "parentFolderId": null,
  "position": 0
}
```

### Endpoints inside collection

- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`

Create endpoint request:

```json
{
  "folderId": null,
  "name": "Create Order",
  "method": "POST",
  "url": "https://api.example.com/orders",
  "headers": [
    { "key": "Accept", "value": "application/json", "enabled": true }
  ],
  "queryParams": [],
  "body": {
    "mode": "raw",
    "contentType": "application/json",
    "raw": "{\"sku\":\"ABC\",\"qty\":1}"
  },
  "auth": { "type": "none" },
  "position": 0
}
```

### Endpoint examples

- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`

Create example request:

```json
{
  "name": "200 success",
  "statusCode": 200,
  "headers": [{ "key": "content-type", "value": "application/json" }],
  "body": "{\"ok\":true}",
  "position": 0
}
```

## Request body mode reference

Supported in collection endpoint payloads.

### `raw`

```json
{
  "mode": "raw",
  "contentType": "application/json",
  "raw": "{\"hello\":\"world\"}"
}
```

### `urlencoded`

```json
{
  "mode": "urlencoded",
  "entries": [
    { "key": "page", "value": "1", "enabled": true },
    { "key": "size", "value": "20" }
  ]
}
```

### `formdata`

```json
{
  "mode": "formdata",
  "entries": [
    { "type": "text", "key": "name", "value": "report" },
    {
      "type": "file",
      "key": "attachment",
      "fileName": "report.txt",
      "contentType": "text/plain",
      "dataBase64": "VGhpcyBpcyBhIHRlc3QgZmlsZS4="
    }
  ]
}
```

### `binary`

```json
{
  "mode": "binary",
  "fileName": "blob.bin",
  "contentType": "application/octet-stream",
  "dataBase64": "AAEC"
}
```

### `none`

```json
{ "mode": "none" }
```

## Environments API

### Environment CRUD

- `GET /api/v1/workspaces/:workspaceId/environments`
- `GET /api/v1/workspaces/:workspaceId/environments/:environmentId`
- `POST /api/v1/workspaces/:workspaceId/environments`
- `PATCH /api/v1/workspaces/:workspaceId/environments/:environmentId`
- `DELETE /api/v1/workspaces/:workspaceId/environments/:environmentId`

Create environment request:

```json
{ "name": "Dev" }
```

### Variables

- `GET /api/v1/workspaces/:workspaceId/environments/:environmentId/variables`
- `GET /api/v1/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `POST /api/v1/workspaces/:workspaceId/environments/:environmentId/variables`
- `PATCH /api/v1/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `DELETE /api/v1/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`

Create variable request:

```json
{
  "key": "host",
  "value": "api.example.com",
  "enabled": true,
  "isSecret": false,
  "position": 0
}
```

## Import/Export API

### List jobs

`GET /api/v1/workspaces/:workspaceId/import-export/jobs`

### Get single job

`GET /api/v1/workspaces/:workspaceId/import-export/jobs/:jobId`

### Create export job

`POST /api/v1/workspaces/:workspaceId/import-export/exports`

Request:

```json
{
  "format": "json",
  "includeCollections": true,
  "includeEnvironments": true
}
```

### Create import job

`POST /api/v1/workspaces/:workspaceId/import-export/imports`

Request:

```json
{
  "format": "json",
  "payload": {
    "collections": [],
    "environments": []
  }
}
```

## Permission summary

- `owner` and `admin` can write in collections/environments/import-export
- `member` has read access but write restrictions in collection/environment/import-export modules
- member management operations are owner-only

## Common error codes by scenario

- `400`: validation and domain constraint failures
- `401`: missing/invalid token or invalid auth context
- `403`: missing workspace membership or insufficient role
- `404`: scoped resource not found
- `409`: conflict scenarios
- `500`: unexpected server errors

## Operational tips

- Prefer creating folders before endpoints for cleaner organization
- Use endpoint examples to keep API behavior documented per request
- Use environment `isSecret=true` for sensitive variable values

## Current limitations

- No version snapshots and no fork/merge for collections yet
- Import/export currently tracks jobs and summaries, not full async file lifecycle
