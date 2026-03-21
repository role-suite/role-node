# Import/Export Module

Base route: `/api/workspaces/:workspaceId/import-export`

This module provides a workspace-scoped job log for export and import actions.

## Authorization model

- Workspace `owner` and `admin` can create export/import jobs.
- Workspace `member` can list and read existing jobs.
- Any non-member gets `403 Workspace access denied`.

## Endpoints

- `GET /api/workspaces/:workspaceId/import-export/jobs`
- `GET /api/workspaces/:workspaceId/import-export/jobs/:jobId`
- `POST /api/workspaces/:workspaceId/import-export/exports`
- `POST /api/workspaces/:workspaceId/import-export/imports`

## Request payloads

Create export job:

```json
{
  "format": "json",
  "includeCollections": true,
  "includeEnvironments": true,
  "includeRuns": false
}
```

Create import job:

```json
{
  "format": "json",
  "payload": {
    "collections": [],
    "environments": []
  }
}
```

## Notes

- Jobs are currently stored in-memory and marked `completed` immediately.
- This gives a stable API boundary while SQL persistence and background workers are introduced.
