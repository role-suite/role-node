# Environments Module

Base route: `/api/v1/workspaces/:workspaceId/environments`

This module stores workspace-scoped environments and their key/value variables.

## Authorization model

- Workspace `owner` and `admin` can create, update, and delete environments and variables.
- Workspace `member` can list and read environments and variables.
- Any non-member gets `403 Workspace access denied`.

## Errors

- `409 Environment name already exists` when creating/renaming an environment to a name already
  used in the workspace.
- `409 Environment variable key already exists` when creating/renaming a variable to a key
  already used in the environment.
- Both conflicts are enforced by the DB's `UNIQUE` constraints (see Persistence below), not just
  an application-level check, so they resolve correctly even when two requests race to create the
  same name/key at the same time.

## Endpoints

- `GET /api/v1/workspaces/:workspaceId/environments`
- `GET /api/v1/workspaces/:workspaceId/environments/:environmentId`
- `POST /api/v1/workspaces/:workspaceId/environments`
- `PATCH /api/v1/workspaces/:workspaceId/environments/:environmentId`
- `DELETE /api/v1/workspaces/:workspaceId/environments/:environmentId`

### Variable routes

- `GET /api/v1/workspaces/:workspaceId/environments/:environmentId/variables`
- `GET /api/v1/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `POST /api/v1/workspaces/:workspaceId/environments/:environmentId/variables`
- `PATCH /api/v1/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `DELETE /api/v1/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`

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

Migration: `migrations/20260321_003_create_environments_schema.migration.ts` (also creates `environment_variables`).

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
