# Workspaces Module

Base route: `/api/v1/workspaces`

This module provides Postman-style workspace management for authenticated users.

## Behavior

- Every endpoint requires `Authorization: Bearer <access-token>`.
- Listing returns workspaces where the authenticated user is a member.
- Creating a workspace always creates a `team` workspace and adds the creator as `owner`. The
  workspace row and the owner membership are created in a single DB transaction, so a failure
  partway through can't leave an ownerless, orphaned workspace behind.
- Getting workspace details requires membership in that workspace.
- Owners can manage team workspace members.
- Invitations are required for members to self-join a team workspace.

## Endpoints

### `GET /api/v1/workspaces`

Returns all workspaces for the current user.

Response item shape:

- `id`
- `name`
- `slug`
- `type`
- `role`

### `POST /api/v1/workspaces`

Creates a new team workspace.

Request body:

```json
{
  "name": "Platform Team"
}
```

Validation:

- `name`: string, trimmed, min 2, max 120

### `GET /api/v1/workspaces/:workspaceId`

Returns workspace summary for current user membership.

Errors:

- `403 Workspace access denied` when user is not a member
- `404 Workspace not found` when membership exists but workspace row is missing

### `GET /api/v1/workspaces/:workspaceId/members`

Lists members of the workspace for any current workspace member.

### `POST /api/v1/workspaces/:workspaceId/members`

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
- `409 User is already a workspace member` if the target already has a membership, including when
  two requests race to add the same user at the same time (backed by the DB's
  `UNIQUE(user_id, workspace_id)` constraint, not just an app-level check).

### `POST /api/v1/workspaces/:workspaceId/invitations`

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

### `POST /api/v1/workspaces/join`

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
- `409 User is already a workspace member` if the invitee already has a membership - including a
  double-submitted join with the same token racing itself. The membership create and the
  invitation's accepted-at update run in one transaction.

### `POST /api/v1/workspaces/:workspaceId/convert-to-team`

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

### `PATCH /api/v1/workspaces/:workspaceId/members/:memberUserId`

Updates workspace role (`member` or `admin`) for an existing member.

Rules:

- Only workspace owners can update roles.
- Owner role cannot be reassigned through this endpoint.

### `DELETE /api/v1/workspaces/:workspaceId/members/:memberUserId`

Removes a member from the workspace.

Rules:

- Only workspace owners can remove members.
- Owner cannot remove themselves here; use leave endpoint.
- Last owner cannot be removed.

### `POST /api/v1/workspaces/:workspaceId/leave`

Current user leaves the workspace.

Rules:

- Last workspace owner cannot leave.

### `GET /api/v1/workspaces/:workspaceId/updates`

Lists workspace events (member changes, invitations) by cursor.

Query params:

- `since`: event id cursor (default `0`)
- `limit`: max events (default `50`)

## Implementation notes

- Module files:
  - `src/modules/workspaces/route.ts`
  - `src/modules/workspaces/controller.ts`
  - `src/modules/workspaces/service.ts`
  - `src/modules/workspaces/events.service.ts`
  - `src/modules/workspaces/schema.ts`
- There is no `workspaces/repo.ts`; persistence is delegated entirely through `authRepo`
  (`src/modules/auth/repo.ts`), including `withAuthTransaction` for the multi-write paths above.
