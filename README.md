<p align="center">
  <img src="docs/assets/app_logo.png" alt="Röle Logo" width="120" height="120">
</p>

<h1 align="center">Röle Node</h1>

<p align="center">
  <a href="https://github.com/role-suite/role-node/actions/workflows/ci.yml"><img src="https://github.com/role-suite/role-node/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/role-suite/role-node/actions/workflows/codeql.yml"><img src="https://github.com/role-suite/role-node/actions/workflows/codeql.yml/badge.svg" alt="CodeQL"></a>
  <a href="https://github.com/role-suite/role-node/blob/main/docs/badges/coverage.svg"><img src="https://raw.githubusercontent.com/role-suite/role-node/main/docs/badges/coverage.svg" alt="Coverage"></a>
</p>

<p align="center">
  <strong>TypeScript + Express REST backend for team-synced workspaces, collections, environments, and Röle-native import/export</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#local-database-docker">Local Database</a> •
  <a href="#api-overview">API Overview</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#security">Security</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Overview

<p align="center">
  role-node is a modular team-synchronization backend built with Express 5 and TypeScript. It keeps a team's workspaces, collections, environments, and variables in sync across every member via workspace-based REST APIs, with Röle-native import/export, strict schema validation, and consistent error handling. It targets Postgres with migration support and a tested module structure.
</p>

## Features

### Core

- Strict Zod validation and centralized error responses
- Workspace model with teams, invitations, roles, and activity updates
- Collections, environments, and variables kept in sync across workspace members
- Import/export job support

### Quality

- Multi-layer tests: unit, integration, security, smoke, e2e
- Clean module boundaries and repo/service/controller separation

### Platform

- Postgres support
- Migrations with a repeatable Docker reset workflow

## Quick Start

1. Install dependencies

```bash
pnpm install
```

2. Create your local environment file

```bash
cp .env.example .env
```

3. Start development server

```bash
pnpm dev
```

The server starts on `PORT` (default `3000`).

## Local Database (Docker)

Start a fresh Postgres container from `docker-compose.yml`:

```bash
pnpm db:reset:docker
```

Apply migrations:

```bash
pnpm db:migrate
```

## Scripts

- `pnpm dev`: run server with file watch
- `pnpm build`: compile TypeScript to `dist/`
- `pnpm start`: run compiled server from `dist/`
- `pnpm db:migrate`: apply pending migrations
- `pnpm db:migrate:up`: apply pending migrations (optionally with count)
- `pnpm db:migrate:down`: rollback latest migration (optionally with count)
- `pnpm db:migrate:status`: print applied/pending migration status
- `pnpm db:reset:docker`: reset dockerized DBs (down -v, up -d)
- `pnpm test`: run tests in Vitest
- `pnpm test:watch`: run tests in watch mode
- `pnpm test:run`: run tests once
- `pnpm test:coverage`: run tests with coverage report
- `pnpm verify`: run local integrity gate (format, lint, typecheck, test, build)

## Environment Variables

Environment values are validated in `src/config/env.ts`. See `docs/guides/development.md` for local runtime variables and `docs/guides/launch.md` for production launch configuration.

## API Overview

REST routes are mounted under `/api/v1`.

- Health: `GET /health`
- Auth: registration, login, refresh, logout, profile, workspace switching, and session management.
- Workspaces: workspace CRUD, invitations, membership management, leave, conversion, and update polling.
- Collections: collections, folders, saved endpoints, and endpoint examples.
- Environments: environments and variables.
- Import/export: workspace-scoped import/export jobs.

See `docs/guides/user-reference-manual.md` for endpoint and payload examples, or run the server outside production and open `/docs` for Swagger UI.

## Documentation

- `docs/guides/development.md`: local workflow, scripts, CI/CD, and runtime configuration
- `docs/guides/client-integration.md`: client integration patterns and SDK behavior
- `docs/guides/user-reference-manual.md`: endpoint and payload reference
- `docs/guides/launch.md`: greenfield production launch checklist
- `docs/compatibility.md`: role-node / role-sdk / role-client compatibility matrix
- `docs/errors.md`: machine-readable error model and code registry
- `docs/README.md`: documentation index
- `docs/modules/*`: module-specific behavior
- `migrations/README.md`: migration workflow

## Security

Please report security vulnerabilities privately.

- Email: `taneri862@gmail.com`
- Do not open public issues for security concerns

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See `LICENSE` for details.
