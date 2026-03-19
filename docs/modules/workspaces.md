# Workspaces Module

Base route: `/api/workspaces`

This module provides Postman-style workspace management for authenticated users.

## Behavior

- Every endpoint requires `Authorization: Bearer <access-token>`.
- Listing returns workspaces where the authenticated user is a member.
- Creating a workspace always creates a `team` workspace and adds the creator as `owner`.
- Getting workspace details requires membership in that workspace.
- Owners can manage team workspace members.

## Endpoints

### `GET /api/workspaces`

Returns all workspaces for the current user.

Response item shape:

- `id`
- `name`
- `slug`
- `type`
- `role`

### `POST /api/workspaces`

Creates a new team workspace.

Request body:

```json
{
  "name": "Platform Team"
}
```

Validation:

- `name`: string, trimmed, min 2, max 120

### `GET /api/workspaces/:workspaceId`

Returns workspace summary for current user membership.

Errors:

- `403 Workspace access denied` when user is not a member
- `404 Workspace not found` when membership exists but workspace row is missing

### `GET /api/workspaces/:workspaceId/members`

Lists members of the workspace for any current workspace member.

### `POST /api/workspaces/:workspaceId/members`

Adds an existing user to a team workspace.

Request body:

```json
{
  "email": "member@example.com",
  "role": "member"
}
```

Rules:

- Only workspace owners can add members.
- Personal workspaces cannot accept additional members.
- Target user must already exist.

### `PATCH /api/workspaces/:workspaceId/members/:memberUserId`

Updates workspace role (`member` or `admin`) for an existing member.

Rules:

- Only workspace owners can update roles.
- Owner role cannot be reassigned through this endpoint.

### `DELETE /api/workspaces/:workspaceId/members/:memberUserId`

Removes a member from the workspace.

Rules:

- Only workspace owners can remove members.
- Owner cannot remove themselves here; use leave endpoint.
- Last owner cannot be removed.

### `POST /api/workspaces/:workspaceId/leave`

Current user leaves the workspace.

Rules:

- Last workspace owner cannot leave.

## Implementation notes

- Module files:
  - `src/modules/workspaces/workspaces.route.ts`
  - `src/modules/workspaces/workspaces.controller.ts`
  - `src/modules/workspaces/workspaces.service.ts`
  - `src/modules/workspaces/workspaces.repo.ts`
  - `src/modules/workspaces/workspaces.schema.ts`
- Persistence is delegated through auth-backed workspace/membership repo functions.
