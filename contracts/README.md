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

## Scope note

This directory covers module-level public API routes. Non-module operational routes (for example `/health`) are intentionally outside this module contract set.
