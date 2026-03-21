# Import/Export Module

Base route: `/api/workspaces/:workspaceId/import-export`

This module exposes workspace-scoped import/export job endpoints and returns a job history timeline for each workspace.

## Behavior

- Every route requires authenticated request context.
- Workspace `owner` and `admin` can create export/import jobs.
- Workspace `member` can list and read existing jobs.
- Non-members get `403 Workspace access denied`.
- Create routes currently complete synchronously and return jobs in `completed` state.

## Endpoints

### `GET /api/workspaces/:workspaceId/import-export/jobs`

Lists jobs for the workspace, newest first.

### `GET /api/workspaces/:workspaceId/import-export/jobs/:jobId`

Returns one job by id.

Errors:

- `404 Import/export job not found` when the job id is not present in that workspace.

### `POST /api/workspaces/:workspaceId/import-export/exports`

Creates an export job.

Request body:

```json
{
  "format": "json",
  "includeCollections": true,
  "includeEnvironments": true,
  "includeRuns": false
}
```

Validation and defaults:

- `format`: only `json` (defaults to `json`)
- `includeCollections`: optional boolean (defaults to `true`)
- `includeEnvironments`: optional boolean (defaults to `true`)
- `includeRuns`: optional boolean (defaults to `false`)

Authorization:

- `member` gets `403 Only workspace owners and admins can run imports and exports`.

### `POST /api/workspaces/:workspaceId/import-export/imports`

Creates an import job.

Request body:

```json
{
  "format": "json",
  "payload": {
    "collections": [],
    "environments": []
  }
}
```

Validation:

- `format`: only `json` (defaults to `json`)
- `payload`: required object with string keys and unknown values

Authorization:

- `member` gets `403 Only workspace owners and admins can run imports and exports`.

## Response shape

Each job in list/get/create responses contains:

- `id`
- `workspaceId`
- `type` (`export` or `import`)
- `status` (`completed`)
- `format` (`json`)
- `summary` (details derived from request payload)
- `createdByUserId`
- `createdAt`
- `completedAt`

`summary` values:

- Export jobs include `includeCollections`, `includeEnvironments`, `includeRuns`.
- Import jobs include `rootKeys` and `rootKeyCount` from `payload` top-level keys.

## Implementation notes

- Module files:
  - `src/modules/import-export/import-export.route.ts`
  - `src/modules/import-export/import-export.controller.ts`
  - `src/modules/import-export/import-export.service.ts`
  - `src/modules/import-export/import-export.repo.ts`
  - `src/modules/import-export/import-export.schema.ts`
- Repository storage is database-backed in `import_export_jobs`.
- Migration: `migrations/20260322_007_create_import_export_jobs_table.migration.ts`.
- Jobs are inserted and marked `completed` with identical `createdAt` and `completedAt` timestamps.

## Test coverage

- Unit:
  - `tests/unit/import-export.schema.test.ts`
  - `tests/unit/import-export.service.test.ts`
