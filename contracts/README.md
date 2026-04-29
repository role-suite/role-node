# API Contracts

This directory covers REST API contracts. gRPC contracts are maintained in `proto/*.proto`.

This directory is the single source of truth for role-node public REST API contracts.

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

5. Refresh and verify public contract artifacts:

```bash
pnpm contracts:generate
pnpm contracts:check
pnpm contracts:breaking-check
pnpm contracts:docs-check
pnpm contracts:openapi:generate
pnpm contracts:openapi:check
pnpm contracts:openapi:lint
```

Generated artifacts committed to git:

- `contracts/generated/public-api.snapshot.json`
- `contracts/generated/openapi.json`

The OpenAPI artifact is the publishable contract output for external consumers (SDK generation, client integration checks, and partner distribution).

## Contract drift validation

CI runs a dedicated **Contract Check** job to keep runtime routes, contracts, and docs aligned.

It fails when any of these drift signals appear:

- Runtime route exists without a contract (undocumented route)
- Contract route exists but is no longer registered in runtime routing
- Request or response schema shape changed
- Previously documented public fields were removed

It also fails when:

- A contract artifact change is incompatible with the base branch (removed endpoint, removed response fields, or newly required request fields)
- Contract artifact changed but docs were not updated
- OpenAPI artifact is stale relative to contract definitions

## Scope note

This directory covers module-level public REST routes. Non-module operational routes (for example `/health`) are intentionally outside this module contract set.

gRPC service definitions (`role.v1`) are versioned separately in `proto/*.proto` and validated through `pnpm grpc:check`.

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
