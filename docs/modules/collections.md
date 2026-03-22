# Collections Module

Base route: `/api/workspaces/:workspaceId/collections`

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

- `GET /api/workspaces/:workspaceId/collections`
- `GET /api/workspaces/:workspaceId/collections/:collectionId`
- `POST /api/workspaces/:workspaceId/collections`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId`

### Collection endpoint routes

- `GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `POST /api/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`

### Folder routes

- `GET /api/workspaces/:workspaceId/collections/:collectionId/folders`
- `POST /api/workspaces/:workspaceId/collections/:collectionId/folders`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`

### Endpoint example routes

- `GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `POST /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`

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

Migration: `migrations/20260320_002_create_collections_table.migration.ts`

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

Migration: `migrations/20260320_003_create_collection_endpoints_table.migration.ts`

`folder_id` support and examples/folder tables are added in:

- `migrations/20260322_008_expand_collections_structure.migration.ts`
