# Collections Module

Base route: `/api/v1/workspaces/:workspaceId/collections`

This module stores API endpoint collections within a workspace.

Collections also store request endpoint definitions (method, URL, headers, query params, body, auth).

Endpoint request body modes:

- `raw`: string payload with optional `contentType`
- `urlencoded`: key/value entry list
- `formdata`: text + file parts (file parts contain base64 payload)
- `binary`: single file payload (base64)
- `none`: explicit no-body marker

## Authorization model

- Workspace `owner` and `admin` can create, update, and delete collections.
- Workspace `member` can list and read collections.
- Any non-member gets `403 Workspace access denied`.

## Endpoints

- `GET /api/v1/workspaces/:workspaceId/collections`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId`
- `POST /api/v1/workspaces/:workspaceId/collections`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId`

### Collection endpoint routes

- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`

### Folder routes

- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/folders`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/folders`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`

### Endpoint example routes

- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`

## Request payloads

Create:

```json
{
  "name": "Orders API",
  "description": "Collection for orders endpoints"
}
```

Update (at least one field):

```json
{
  "name": "Orders API v2"
}
```

Create endpoint:

```json
{
  "name": "Get Orders",
  "method": "GET",
  "url": "https://api.example.com/orders",
  "folderId": null,
  "headers": [{ "key": "Accept", "value": "application/json" }],
  "queryParams": [{ "key": "limit", "value": "20" }],
  "body": { "mode": "raw", "contentType": "application/json", "raw": "{}" },
  "auth": { "type": "none" },
  "position": 0
}
```

## Persistence

Table: `collections`

- `id`
- `workspace_id` (FK -> `workspaces.id`)
- `name`
- `description`
- `created_by_user_id` (FK -> `auth_users.id`)
- `created_at`
- `updated_at`

Migration: `migrations/20260320_002_create_collections_schema.migration.ts` (also creates `collection_folders`, `collection_endpoints`, and `collection_endpoint_examples`).

### Endpoint persistence

Table: `collection_endpoints`

- `id`
- `collection_id` (FK -> `collections.id`)
- `name`
- `method`
- `url`
- `headers_json`
- `query_params_json`
- `body_json`
- `auth_json`
- `position`
- `created_by_user_id` (FK -> `auth_users.id`)
- `created_at`
- `updated_at`

`folder_id` (FK -> `collection_folders.id`) supports organizing endpoints into folders.
