# API Versioning Policy

This policy applies to both public transports in role-node:

- REST API contracts (`contracts/generated/openapi.json`)
- gRPC contracts (`proto/*.proto`)

## Current approach

role-node keeps current public paths (for example, `/api/auth/login`, `/api/workspaces/:workspaceId/...`) and uses an explicit versioning policy for contract stability.

- Current stable API line: `v1`.
- Route prefixes do not include `/v1` yet.
- Breaking changes are introduced only in a new API line (for example, `v2`) with explicit announcement.
- gRPC package line is `role.v1` and follows additive-first evolution.

SDKs and clients should declare compatibility as: `role-node API v1` (REST and/or gRPC `role.v1`).

## Contract source of truth

Public contract definitions live in:

- `contracts/index.ts`
- `contracts/README.md`
- `contracts/generated/public-api.snapshot.json`
- `contracts/generated/openapi.json`

Any change to public behavior must update contracts in the same pull request.

For gRPC, proto definitions are distributed to SDK consumers via tag pinning workflow documented in `docs/guides/grpc-proto-distribution.md`.

## Change classification

### Breaking route changes

A route change is breaking if it does any of the following:

- Removes an existing route.
- Renames a route path segment.
- Changes HTTP method for an existing route.
- Changes auth requirement for an existing route (`none` <-> `bearer`).
- Changes path/query parameter meaning or type incompatibly.
- Changes success status code for the primary success path in an incompatible way.

### Breaking field changes

A field-level change is breaking if it does any of the following:

- Removes a request or response field.
- Renames a request or response field.
- Changes field type incompatibly (for example, `string` -> `number`).
- Makes an optional request field required.
- Narrows allowed enum/union values.
- Changes field semantics in a way that invalidates existing clients.

### Additive changes

An additive change is non-breaking when it does any of the following:

- Adds a new route.
- Adds a new optional request field.
- Adds a new response field while preserving existing fields.
- Adds a new enum/union value where clients are expected to handle unknown values safely.
- Adds new error codes/statuses without changing existing success/error contracts.

## gRPC compatibility rules (`role.v1`)

These rules apply to all files under `proto/*.proto`.

### Breaking proto changes

A proto change is breaking if it does any of the following:

- Removes an existing RPC method.
- Renames an existing RPC method or service.
- Changes request/response message type for an existing RPC.
- Removes a message field.
- Changes a field type incompatibly.
- Changes field cardinality incompatibly (`optional`/`repeated`/singular).
- Reuses or renumbers an existing field tag.
- Moves a method or message to a different package line.

### Non-breaking proto changes

A proto change is additive/non-breaking when it does any of the following:

- Adds a new RPC method to an existing service.
- Adds a new optional field to a message using a new field tag.
- Adds a new message or enum that does not alter existing method signatures.
- Adds enum values where clients are expected to tolerate unknown values.

### Field/tag safety requirements

- Never reuse field numbers.
- Never change field numbers for existing fields.
- When removing fields, reserve removed field numbers and names in proto definitions.
- Keep `role.v1` package stable for additive changes.

### Version bump policy for gRPC

- Keep `role.v1` for additive, backward-compatible changes.
- Introduce `role.v2` for breaking wire or semantic changes.
- Publish migration guidance before or with first `role.v2` release.

## Deprecation and support windows

When a route or field is deprecated:

- It is marked as deprecated in docs and contracts notes.
- It remains supported for **at least 180 days** from deprecation announcement.
- Removal happens only in the next major API line (for example, `v2`).

During the support window, behavior remains compatible except for critical security fixes.

## Release and compatibility communication

- API compatibility statements are published in release notes.
- SDK releases should explicitly state: `Supports role-node API v1`.
- If a breaking change is needed, a migration guide is published before/with the new API line.
- gRPC-impacting releases should explicitly mention `role.v1` compatibility status and any required SDK regeneration.
