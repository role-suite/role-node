# gRPC Proto Distribution for SDK Consumers

This document defines how SDK repositories (including `role-sdk`) consume gRPC contracts from `role-node`.

## Distribution strategy

`role-node` uses **git tag pinning** as the single source mechanism for proto distribution.

- SDKs must fetch `proto/*.proto` from a specific released tag (for example `v1.2.3`), not from `main`.
- SDK pipelines must treat the selected tag as immutable contract input for code generation.
- Proto updates are consumed only when SDK maintainers intentionally bump the pinned `role-node` tag.

## Canonical source path

- Source repository: `role-suite/role-node`
- Contract path: `proto/*.proto`
- Package namespace: `role.v1`

## Pinning rules

- Use only published release tags (`v*`) for SDK generation.
- Do not pin to branch names or floating refs.
- Keep the pinned tag in one explicit location in the SDK repository (for example `SDK_PROTO_SOURCE_TAG`).

## Update cadence and ownership

- **Publisher owner (role-node):** Backend maintainers publish proto changes through normal release tags.
- **Consumer owner (role-sdk):** SDK maintainers decide when to bump the pinned tag and regenerate client code.
- **Cadence:** SDKs should review new `role-node` tags on each planned SDK release cycle.

## Required PR notes for proto changes

When `proto/*.proto` changes in `role-node`, PRs must state:

- whether changes are additive or breaking,
- expected SDK impact,
- whether `role.v1` compatibility is preserved.

## Why this strategy

Git tag pinning gives SDK repositories reproducible inputs, clear change boundaries, and explicit upgrade timing without coupling SDK generation to backend mainline churn.
