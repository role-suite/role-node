# API Contracts

This directory is the single source of truth for role-node public API contracts.

It documents every public route under these modules:

- `contracts/auth/`
- `contracts/workspaces/`
- `contracts/collections/`
- `contracts/environments/`
- `contracts/runs/`
- `contracts/import-export/`

Each endpoint contract defines:

- HTTP method
- Public path
- Authentication requirement (`none` or `bearer`)
- Request schema (`params`, `query`, `body` as applicable)
- Success response schema
- Error response schema(s)

## Contract format

Contracts are authored in TypeScript + Zod and are exported from `contracts/index.ts`.

- Request schemas are imported from the same module schemas used by controllers in `src/modules/**/**.schema.ts`.
- Success and error response schemas are defined here using the shared envelope from `src/shared/app-response.ts`.

This keeps API behavior and contract definitions aligned while still giving SDK/client teams one stable location to inspect.

## Maintenance workflow

When changing or adding a public endpoint:

1. Update route/controller/service implementation under `src/modules/**`.
2. Update or add request schema in the module `*.schema.ts` if needed.
3. Update matching endpoint contract in `contracts/<module>/contracts.ts`.
4. Verify the endpoint appears in `contracts/index.ts` (`allContracts`).

5. Refresh and verify public schema snapshot:

```bash
pnpm contracts:generate
pnpm contracts:check
```

The generated snapshot is committed at `contracts/generated/public-api.snapshot.json`.

## Contract drift validation

CI runs `pnpm contracts:check` to keep runtime routes, contracts, and docs aligned.

It fails when any of these drift signals appear:

- Runtime route exists without a contract (undocumented route)
- Contract route exists but is no longer registered in runtime routing
- Request or response schema shape changed
- Previously documented public fields were removed

## Scope note

This directory covers module-level public API routes. Non-module operational routes (for example `/health`) are intentionally outside this module contract set.

## Success response shapes

All successful API responses use the shared envelope:

```json
{ "success": true, "data": ... }
```

Use one of these shared `data` shapes (defined in `src/shared/app-response.ts` and `contracts/shared.ts`):

- Object result

```json
{ "success": true, "data": { "id": 1, "name": "Example" } }
```

- List result

```json
{ "success": true, "data": { "items": [{ "id": 1 }] } }
```

- Cursor page result

```json
{
  "success": true,
  "data": {
    "items": [{ "id": 1 }],
    "cursor": { "next": 1, "hasMore": false }
  }
}
```

- Action confirmation result

```json
{ "success": true, "data": { "action": "deleted" } }
```

Allowed action confirmations are: `deleted`, `left`, `revoked`, `cancelled`.

Avoid endpoint-specific one-off success payloads unless there is a strict business need.
