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
  <a href="#features">✨ Features</a> •
  <a href="#quick-start">⚡ Quick Start</a> •
  <a href="#local-database-docker">🐳 Local Database</a> •
  <a href="#api-overview">🧭 API Overview</a> •
  <a href="#documentation">📚 Documentation</a> •
  <a href="#security">🔒 Security</a> •
  <a href="#contributing">🤝 Contributing</a> •
  <a href="#license">📄 License</a>
</p>

---

## 🌟 Overview

<p align="center">
  role-node is a modular team-synchronization backend built with Express 5 and TypeScript. It keeps a team's workspaces, collections, environments, and variables in sync across every member via workspace-based REST APIs, with Röle-native import/export, strict schema validation, and consistent error handling. It targets Postgres with migration support and a tested module structure.
</p>

## ✨ Features

### ⚙️ Core

- Strict Zod validation and centralized error responses
- Workspace model with teams, invitations, roles, and activity updates
- Collections, environments, and variables kept in sync across workspace members
- Import/export job support

### ✅ Quality

- Multi-layer tests: unit, integration, security, smoke, e2e
- Clean module boundaries and repo/service/controller separation

### 🧩 Platform

- Postgres support
- Migrations with a repeatable Docker reset workflow

## ⚡ Quick Start

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

## 🐳 Local Database (Docker)

Start a fresh Postgres container from `docker-compose.yml`:

```bash
pnpm db:reset:docker
```

Apply migrations:

```bash
pnpm db:migrate
```

## 🧰 Scripts

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

## 🚀 CI/CD

- `CI` workflow (`.github/workflows/ci.yml`) runs on pull requests and pushes to `main` and `v*` tags.
- It runs ordered quality gates as separate checks: `1. Format`, `2. Lint`, `3. Test`, `4. Build`, then a required `CI Status` gate.
- `Security` workflow (`.github/workflows/security.yml`) runs dependency audit and gitleaks secret scanning.
- `CodeQL` workflow (`.github/workflows/codeql.yml`) runs static analysis for Actions and JavaScript/TypeScript.
- `Coverage Badge` workflow (`.github/workflows/coverage-badge.yml`) updates `docs/badges/coverage.svg` on pushes to `main`.
- `CD` workflow (`.github/workflows/cd.yml`) builds and publishes Docker images to GHCR and deploys production from `v*` tags or manual dispatch.
- CD is gated by `CI / CI Status` on the exact same commit SHA before publishing/deploying.
- `Release` workflow (`.github/workflows/release-tag.yml`) performs semantic versioning from manual dispatch (`patch`, `minor`, `major`): it runs quality gates, bumps `package.json`, updates `CHANGELOG.md`, creates a `v*` tag, and creates the GitHub Release.
- `Test` gate runs `pnpm test:run` and coverage.

Release flow:

1. Run `Release` from GitHub Actions on `main` and choose `patch`, `minor`, or `major`.
2. The workflow validates quality gates, writes the next semantic version to `package.json`, updates `CHANGELOG.md`, pushes a release commit, and creates a new `v*` tag.
3. It then creates the GitHub Release, and the CD workflow runs automatically for that tag.

Required repository/environment secrets for deployment webhooks:

- `PRODUCTION_DEPLOY_WEBHOOK_URL`

## 🔧 Environment Variables

Validated in `src/config/env.ts` using Zod.

- `NODE_ENV`: `development` | `test` | `production` (default: `development`)
- `PORT`: positive integer (default: `3000`)
- `DB_HOST`: database host
- `DB_PORT`: database port
- `DB_USER`: database user
- `DB_PASSWORD`: database password
- `DB_NAME`: database name
- `DB_POOL_MIN`: minimum pool size (default: `0`)
- `DB_POOL_MAX`: maximum pool size (default: `10`)
- `DB_SSL`: `true` | `false` (default: `false`)
- `ENABLE_STARTUP_VALIDATION`: `true` | `false` (default: `true`)

On startup, the app validates environment values and checks database connectivity with `SELECT 1` before listening for requests.
Set `ENABLE_STARTUP_VALIDATION=false` when running locally without a configured database.

## 🧭 API Overview

This section lists REST endpoints.

### Health

- `GET /health`

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/switch-workspace`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions/:sessionId`

### Workspaces

- `GET /api/v1/workspaces`
- `POST /api/v1/workspaces`
- `GET /api/v1/workspaces/:workspaceId`
- `GET /api/v1/workspaces/:workspaceId/members`
- `POST /api/v1/workspaces/:workspaceId/members`
- `PATCH /api/v1/workspaces/:workspaceId/members/:memberUserId`
- `DELETE /api/v1/workspaces/:workspaceId/members/:memberUserId`
- `POST /api/v1/workspaces/:workspaceId/invitations`
- `POST /api/v1/workspaces/join`
- `POST /api/v1/workspaces/:workspaceId/leave`
- `POST /api/v1/workspaces/:workspaceId/convert-to-team`
- `GET /api/v1/workspaces/:workspaceId/updates`

### Collections

- `GET /api/v1/workspaces/:workspaceId/collections`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId`
- `POST /api/v1/workspaces/:workspaceId/collections`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`
- `GET /api/v1/workspaces/:workspaceId/collections/:collectionId/folders`
- `POST /api/v1/workspaces/:workspaceId/collections/:collectionId/folders`
- `PATCH /api/v1/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`
- `DELETE /api/v1/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`

### Environments

- `GET /api/v1/workspaces/:workspaceId/environments`
- `GET /api/v1/workspaces/:workspaceId/environments/:environmentId`
- `POST /api/v1/workspaces/:workspaceId/environments`
- `PATCH /api/v1/workspaces/:workspaceId/environments/:environmentId`
- `DELETE /api/v1/workspaces/:workspaceId/environments/:environmentId`
- `GET /api/v1/workspaces/:workspaceId/environments/:environmentId/variables`
- `GET /api/v1/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `POST /api/v1/workspaces/:workspaceId/environments/:environmentId/variables`
- `PATCH /api/v1/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `DELETE /api/v1/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`

### Import/Export

- `GET /api/v1/workspaces/:workspaceId/import-export/jobs`
- `GET /api/v1/workspaces/:workspaceId/import-export/jobs/:jobId`
- `POST /api/v1/workspaces/:workspaceId/import-export/exports`
- `POST /api/v1/workspaces/:workspaceId/import-export/imports`

## 📚 Documentation

- `docs/guides/client-integration.md`: full client integration and payload reference
- `docs/guides/launch.md`: greenfield production launch checklist
- `docs/compatibility.md`: role-node / role-sdk / role-client compatibility matrix
- `docs/errors.md`: machine-readable error model and code registry
- `docs/README.md`: documentation index
- `docs/modules/*`: module-specific behavior
- `migrations/README.md`: migration workflow

## 🔒 Security

Please report security vulnerabilities privately.

- Email: `taneri862@gmail.com`
- Do not open public issues for security concerns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for details.
