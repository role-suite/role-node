# gRPC and REST Transport Parity

This document defines parity expectations between REST and gRPC transports.

## Critical parity flows

- Auth lifecycle: register, login, refresh, logout, me.
- Workspace membership lifecycle: create workspace, invite, join, role updates, leave.
- Collections/environments CRUD behavior and validation parity.
- Runs lifecycle: create, get-by-id, cancel, policy-deny behavior.
- Import/export jobs: list, get-by-id, create export/import jobs.

## Parity acceptance criteria

- Same domain success outcomes across transports.
- Equivalent authorization behavior for protected operations.
- Equivalent validation semantics (field-level constraints and rejection behavior).
- Equivalent domain error codes (transport-specific status/envelope allowed).
- Equivalent policy enforcement (for example localhost blocking behavior for runs).

## Known intentional differences

- Transport-level error representation differs:
  - REST: JSON error envelope + HTTP status.
  - gRPC: status code + metadata.
- Runs/import-export payload transport currently uses JSON-string proto fields for migration parity.

## Verification gates

- gRPC transport checks: `pnpm verify:grpc`
- Broad application checks: `pnpm verify`
- Integration parity confidence is provided through gRPC integration tests and existing REST integration tests.

## Change management

When behavior diverges intentionally, document it in this file and include migration/client guidance in the related PR.
