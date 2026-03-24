# Documentation Book

This folder is maintained as a book-style documentation set.

Start with `docs/guides/system-handbook.md` for the end-to-end narrative, then use module and reference docs for implementation details.

## Reading path

1. `docs/guides/system-handbook.md` - complete system map (architecture, runtime, security, data, operations)
2. `docs/architecture/overview.md` - architecture layers and runtime flow
3. `docs/guides/developer-manual.md` - contributor guide and coding patterns
4. `docs/guides/implementation-manual.md` - implementation playbooks and PR checklist
5. `docs/guides/user-reference-manual.md` - endpoint and payload reference

## Architecture

- `docs/architecture/overview.md`: application layers, runtime flow, and shared infrastructure
- `docs/architecture/request-runner-engine.md`: internal request runner design and implementation strategy

## Guides

- `docs/guides/system-handbook.md`: book-style full system documentation
- `docs/guides/development.md`: day-to-day development workflow and local commands
- `docs/guides/module-template.md`: module generator usage and post-generation checklist
- `docs/guides/module-readiness.md`: production-readiness scorecard and definition of done
- `docs/guides/user-manual.md`: end-user/API-consumer quickstart
- `docs/guides/user-reference-manual.md`: full API user reference with payload examples
- `docs/guides/developer-manual.md`: contributor-focused architecture and development manual
- `docs/guides/implementation-manual.md`: step-by-step implementation playbooks and checklists

## Modules

- `docs/modules/auth.md`: authentication, sessions, token lifecycle, and workspace auth context
- `docs/modules/workspaces.md`: workspace and membership lifecycle
- `docs/modules/collections.md`: collections, endpoints, folders, and endpoint examples
- `docs/modules/environments.md`: environments and environment variable lifecycle
- `docs/modules/runs.md`: request execution API and runner integration
- `docs/modules/import-export.md`: import/export job API and behavior

## Coverage checklist

- Architecture and system internals documented
- Public API routes and payload examples documented
- Security defaults and authorization patterns documented
- Persistence and migration touchpoints documented
- Testing strategy and implementation workflow documented
