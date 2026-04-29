# Documentation Index

This folder is organized by concern across both public transports: REST and gRPC.

- `docs/api-versioning.md`: Public API compatibility and deprecation policy.
- `docs/compatibility.md`: role-node / role-sdk / role-client version compatibility matrix.
- `docs/errors.md`: Unified API error envelope and error code table.
- `docs/route-audit.md`: Route naming audit and anti-drift checklist.

## Architecture

- `docs/architecture/overview.md`: Application layers, runtime flow, and shared infrastructure.
- `docs/architecture/request-runner-engine.md`: Internal-first request runner engine design and implementation plan.

## Guides

- `docs/guides/development.md`: Day-to-day development workflow.
- `docs/guides/client-integration.md`: Client integration flow, API usage, and error handling.
- `docs/guides/grpc-sdk-integration-contract.md`: gRPC metadata, error mapping, and SDK transport contract.
- `docs/guides/grpc-hardening.md`: gRPC TLS/mTLS hardening and compatibility policy.
- `docs/guides/grpc-proto-distribution.md`: Proto distribution and tag pinning workflow for SDK repositories.
- `docs/guides/grpc-sdk-readiness.md`: SDK-side readiness checklist for gRPC integration.
- `docs/guides/grpc-transport-parity.md`: REST/gRPC parity expectations and governance.
- `docs/guides/grpc-typed-payload-migration.md`: Migration plan from JSON-string to typed proto payloads.
- `docs/guides/grpc-governance-ownership.md`: Ownership, SLA, and escalation for proto governance.
- `docs/guides/module-template.md`: Module generator usage and post-generation checklist.
- `docs/guides/module-readiness.md`: Definition of done and readiness criteria.
- `docs/guides/user-manual.md`: End-user/API-consumer quickstart.
- `docs/guides/user-reference-manual.md`: Full API user reference with payload examples.
- `docs/guides/developer-manual.md`: Contributor-focused architecture and development manual.
- `docs/guides/implementation-manual.md`: Step-by-step implementation playbooks and checklists.

## Modules

- `docs/modules/auth.md`: Full auth module design, API behavior, and testing strategy.
- `docs/modules/workspaces.md`: Workspace listing and creation flows.
- `docs/modules/collections.md`: Workspace-scoped API collections CRUD.
- `docs/modules/environments.md`: Workspace-scoped environments and variables CRUD.
- `docs/modules/runs.md`: Workspace-scoped request execution API and runner integration.
- `docs/modules/import-export.md`: Workspace-scoped import/export job API.
