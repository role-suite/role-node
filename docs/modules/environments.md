# Environments Module

Base route: `/api/workspaces/:workspaceId/environments`

This module stores workspace-scoped environments and their key/value variables.

## Authorization model

- Workspace `owner` and `admin` can create, update, and delete environments and variables.
- Workspace `member` can list and read environments and variables.
- Any non-member gets `403 Workspace access denied`.

## Endpoints

- `GET /api/workspaces/:workspaceId/environments`
- `GET /api/workspaces/:workspaceId/environments/:environmentId`
- `POST /api/workspaces/:workspaceId/environments`
- `PATCH /api/workspaces/:workspaceId/environments/:environmentId`
- `DELETE /api/workspaces/:workspaceId/environments/:environmentId`

### Variable routes

- `GET /api/workspaces/:workspaceId/environments/:environmentId/variables`
- `GET /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `POST /api/workspaces/:workspaceId/environments/:environmentId/variables`
- `PATCH /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `DELETE /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`

## Request payloads

Create environment:

```json
{
  "name": "Staging"
}
```

Update environment (at least one field):

```json
{
  "name": "Production"
}
```

Create variable:

```json
{
  "key": "apiUrl",
  "value": "https://api.example.com",
  "enabled": true,
  "isSecret": false,
  "position": 0
}
```

## Persistence

Table: `environments`

- `id`
- `workspace_id` (FK -> `workspaces.id`)
- `name` (unique per workspace)
- `created_by_user_id` (FK -> `auth_users.id`)
- `created_at`
- `updated_at`

Migration: `migrations/20260321_004_create_environments_table.migration.ts`

### Variable persistence

Table: `environment_variables`

- `id`
- `environment_id` (FK -> `environments.id`)
- `key_name` (unique per environment)
- `value_text`
- `enabled`
- `is_secret`
- `position`
- `created_by_user_id` (FK -> `auth_users.id`)
- `created_at`
- `updated_at`

Migration: `migrations/20260321_005_create_environment_variables_table.migration.ts`
