# Import/Export Module

Base route: `/api/v1/workspaces/:workspaceId/import-export`

This module exposes workspace-scoped import/export job endpoints and returns a job history timeline for each workspace.

## Behavior

- Every route requires authenticated request context.
- Workspace `owner` and `admin` can create export/import jobs.
- Workspace `member` can list and read existing jobs.
- Non-members get `403 Workspace access denied`.
- Create routes currently complete synchronously and return jobs in `completed` state.
- Imports are all-or-nothing: every write (collections, folders, endpoints, examples,
  environments, variables, and the job record itself) runs in a single DB transaction. A failure
  partway through (a name/key conflict, an invalid reference, a DB error) rolls back everything,
  so a failed import never leaves orphaned partial data with no job to explain it.

## Endpoints

### `GET /api/v1/workspaces/:workspaceId/import-export/jobs`

Lists jobs for the workspace, newest first.

### `GET /api/v1/workspaces/:workspaceId/import-export/jobs/:jobId`

Returns one job by id.

Errors:

- `404 Import/export job not found` when the job id is not present in that workspace.

### `POST /api/v1/workspaces/:workspaceId/import-export/exports`

Creates an export job.

Request body:

```json
{
  "format": "json",
  "includeCollections": true,
  "includeEnvironments": true
}
```

Validation and defaults:

- `format`: only `json` (defaults to `json`)
- `includeCollections`: optional boolean (defaults to `true`)
- `includeEnvironments`: optional boolean (defaults to `true`)

Authorization:

- `member` gets `403 Only workspace owners and admins can run imports and exports`.

### `POST /api/v1/workspaces/:workspaceId/import-export/imports`

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
- `payload.collections[].folders[].parentSourceId` and
  `payload.collections[].endpoints[].folderSourceId` must reference a `sourceId` declared
  elsewhere in the same collection's `folders` array. A dangling/typo'd reference is rejected
  with `400 Import payload references an unknown sourceId` before any row is written, rather than
  silently reparenting the folder/endpoint to the collection root.

Authorization:

- `member` gets `403 Only workspace owners and admins can run imports and exports`.

Conflicts:

- `409 Environment name already exists` / `409 Environment variable key already exists` when the
  payload's environments/variables collide with existing names/keys in the workspace (or with
  each other within the same payload). The whole import rolls back on this error - see
  "Behavior" above.

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

- Export jobs include `includeCollections`, `includeEnvironments`, `collectionCount`,
  `environmentCount`.
- Import jobs include `rootKeys` and `rootKeyCount` from `payload` top-level keys, plus
  `importedCollections` and `importedEnvironments` counts.

## Workspace sync events

A completed import publishes one `workspace_events` row (`entity: "import_export_job"`,
`action: "completed"`, `entityId: <jobId>`, `payload: { importedCollections, importedEnvironments }`)
inside the same transaction as the rest of the import. This is what makes an import visible to
other clients polling `GET /api/v1/workspaces/:workspaceId/updates` — without it, a bulk import
that adds many collections/environments in one call would be invisible to everyone else on the
workspace until they happened to refetch. Export jobs don't publish an event: they don't mutate
workspace state, so there's nothing for other clients to sync.

## Implementation notes

- Module files:
  - `src/modules/import-export/route.ts`
  - `src/modules/import-export/controller.ts`
  - `src/modules/import-export/service.ts`
  - `src/modules/import-export/repo.ts`
  - `src/modules/import-export/schema.ts`
- Repository storage is database-backed in `import_export_jobs`.
- Migration: `migrations/20260322_004_create_import_export_jobs_table.migration.ts`.
- Jobs are inserted and marked `completed` with identical `createdAt` and `completedAt` timestamps.
- `importExportRepo.withImportExportTransaction` wraps the import write path; `collectionsRepo`
  and `environmentsRepo` writes accept an optional `dbClient` so they participate in the same
  transaction instead of each opening their own connection.

## Test coverage

- Unit:
  - `tests/unit/import-export.schema.test.ts`
  - `tests/unit/import-export.service.test.ts`
