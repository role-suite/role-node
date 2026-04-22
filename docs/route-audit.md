# Route Audit

This audit aligns backend route definitions, contracts, docs, and test fixtures to reduce drift.

## Source of truth

- `src/shared/http/routes.ts`

All public route patterns and router path segments are defined there.

## Audit checks

- Plural resources use plural nouns consistently (`workspaces`, `members`, `collections`, `endpoints`, `examples`, `folders`, `environments`, `variables`, `runs`, `jobs`).
- Action endpoints use stable verb naming (`join`, `leave`, `convert-to-team`, `cancel`).
- Nested ordering is stable: `/api/workspaces/:workspaceId/<resource>/...`.

## Drift fix applied

Known import/export drift was normalized and pinned to:

- `POST /api/workspaces/:workspaceId/import-export/exports`
- `POST /api/workspaces/:workspaceId/import-export/imports`

The same paths are now used in:

- express route mounting and route handlers
- contracts path declarations
- integration/security test fixtures
- README API overview and module docs

## Notes

When adding or changing routes:

1. Update `src/shared/http/routes.ts` first.
2. Update route modules and contracts in the same change.
3. Update docs and tests to consume the same patterns/builders.
