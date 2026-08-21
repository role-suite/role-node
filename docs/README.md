# Documentation Index

This folder is organized by concern for the public REST API and backend runtime.

- `docs/compatibility.md`: role-node / role-sdk / role-client version compatibility matrix.
- `docs/errors.md`: Unified API error envelope and error code table.
- Interactive API docs: run the server outside production and open `/docs` for a Swagger UI
  backed by the live OpenAPI spec (`/docs/openapi.json`), generated from the same zod schemas
  that validate requests.

## Architecture

- `docs/architecture/overview.md`: Application layers, runtime flow, and shared infrastructure.

## Guides

- `docs/guides/development.md`: Day-to-day development workflow.
- `docs/guides/launch.md`: Greenfield production launch checklist.
- `docs/guides/client-integration.md`: Client integration flow, API usage, and error handling.
- `docs/guides/user-manual.md`: End-user/API-consumer quickstart.
- `docs/guides/user-reference-manual.md`: Full API user reference with payload examples.
- `docs/guides/developer-manual.md`: Contributor-focused architecture and development manual.
- `docs/guides/implementation-manual.md`: Step-by-step implementation playbooks and checklists.

## Modules

- `docs/modules/auth.md`: Full auth module design, API behavior, and testing strategy.
- `docs/modules/workspaces.md`: Workspace listing and creation flows.
- `docs/modules/collections.md`: Workspace-scoped API collections CRUD.
- `docs/modules/environments.md`: Workspace-scoped environments and variables CRUD.
- `docs/modules/import-export.md`: Workspace-scoped import/export job API.
