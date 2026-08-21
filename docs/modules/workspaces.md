# Workspaces Module

Base route: `/api/workspaces`

This module provides Postman-style workspace management for authenticated users.

## Behavior

- Every endpoint requires `Authorization: Bearer <access-token>`.
- Listing returns workspaces where the authenticated user is a member.
- Creating a workspace always creates a `team` workspace and adds the creator as `owner`.
- Getting workspace details requires membership in that workspace.
- Owners can manage team workspace members.
- Invitations are required for members to self-join a team workspace.

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

### `POST /api/workspaces/:workspaceId/invitations`

Creates a join invitation for a team workspace.

Request body:

```json
{
  "email": "invitee@example.com",
  "role": "member"
}
```

Rules:

- Only workspace owners can invite members.
- Personal workspaces cannot accept invitations.
- If an unexpired invitation already exists for the email, the request fails.
- If the user is already a member, the request fails.

Response includes a `token` that should be delivered to the invitee.

### `POST /api/workspaces/join`

Accepts an invitation token and joins the workspace.

Request body:

```json
{
  "token": "<invitation-token>"
}
```

Rules:

- Invitation must exist, be unexpired, and unused.
- Invite email must match the authenticated user.
- Personal workspaces cannot accept members.

### `POST /api/workspaces/:workspaceId/convert-to-team`

Converts a personal workspace into a team workspace.

Request body (optional rename):

```json
{
  "name": "Team Workspace"
}
```

Rules:

- Only workspace owners can convert.
- Already-team workspaces cannot be converted.

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

### `GET /api/workspaces/:workspaceId/updates`

Lists workspace events (member changes, invitations) by cursor.

Query params:

- `since`: event id cursor (default `0`)
- `limit`: max events (default `50`)

## Implementation notes

- Module files:
  - `src/modules/workspaces/route.ts`
  - `src/modules/workspaces/controller.ts`
  - `src/modules/workspaces/service.ts`
  - `src/modules/workspaces/repo.ts`
  - `src/modules/workspaces/schema.ts`
- Persistence is delegated through auth-backed workspace/membership repo functions.
