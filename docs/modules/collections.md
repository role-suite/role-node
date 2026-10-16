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

### Version routes

- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/versions`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/versions/:versionId`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/versions`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/versions/:versionId/restore`

## Collection versioning

Every collection-affecting mutation (collection, endpoint, folder, example create/update/delete)
records a full-tree snapshot (`source: "auto"`) in the same transaction as the change. Imports
record one snapshot per imported collection (`source: "import"`). Snapshots store folders,
endpoints, and endpoint examples; entity ids and positions are preserved.

- `POST .../versions` creates a named snapshot (`source: "manual"`). The body accepts an optional
  `label` (1-120 chars).
- `POST .../versions/:versionId/restore` restores a snapshot: the current state is first recorded
  as a `restore` version, then folders, endpoints, and examples are rebuilt with their original
  ids. Restored rows are attributed to the restoring user. Restore requires the writer role and
  publishes `collection.updated` and `collection_version.restored` workspace events.
- `GET .../versions` is cursor-paginated (`limit` 1-200 default 100, `cursor`) and returns
  `{ items, cursor }`, newest first, without snapshot bodies. `GET .../versions/:versionId`
  returns the full `snapshot`.
- Retention: the newest 100 `auto` versions per collection are kept; `manual`, `import`, and
  `restore` versions are never pruned.
- `collection_version.created` events are published for manual versions only; automatic snapshots
  are discovered through the versions listing.

Version errors: `404 COLLECTION_VERSION_NOT_FOUND` for unknown or cross-collection version ids.

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

### Version persistence

Table: `collection_versions`

- `id`
- `collection_id` (FK -> `collections.id`, cascade)
- `version_number` (per collection, unique with `collection_id`)
- `label`
- `source` (`auto` | `manual` | `restore` | `import`)
- `snapshot_json` (full collection tree)
- `created_by_user_id` (FK -> `auth_users.id`)
- `restored_from_version_id` (FK -> `collection_versions.id`, for `restore` versions)
- `created_at`

Migration: `migrations/20261016_007_create_collection_versions_table.migration.ts`.

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
