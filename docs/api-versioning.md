# API Versioning Policy

## Current approach

role-node keeps current public paths (for example, `/api/auth/login`, `/api/workspaces/:workspaceId/...`) and uses an explicit versioning policy for contract stability.

- Current stable API line: `v1`.
- Route prefixes do not include `/v1` yet.
- Breaking changes are introduced only in a new API line (for example, `v2`) with explicit announcement.

SDKs and clients should declare compatibility as: `role-node API v1`.

## Contract source of truth

Public contract definitions live in:

- `contracts/index.ts`
- `contracts/README.md`

Any change to public behavior must update contracts in the same pull request.

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
