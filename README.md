<p align="center">
  <img src="assets/app_logo.png" alt="Röle Logo" width="120" height="120">
</p>

<h1 align="center">Röle Node</h1>

<p align="center">
  <strong>TypeScript + Express backend for workspaces, collections, environments, and request runs</strong>
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
  role-node is a modular backend starter built with Express 5 and TypeScript. It provides a workspace-based API for collections, environments, and runnable HTTP requests, with strict schema validation and consistent error handling. It targets Postgres or MySQL with migration support and a tested module structure.
</p>

## ✨ Features

### ⚙️ Core

- Strict Zod validation and centralized error responses
- Workspace model with teams, invitations, roles, and activity updates
- Collections, environments, variables, and request runs
- Import/export job support

### ✅ Quality

- Multi-layer tests: unit, integration, contract, security, smoke, e2e
- Clean module boundaries and repo/service/controller separation

### 🧩 Platform

- Postgres + MySQL support
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

Start fresh Postgres + MySQL containers from `docker-compose.yml`:

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
- `pnpm create:module <name>`: scaffold a new feature module template
- `pnpm db:migrate`: apply pending migrations
- `pnpm db:migrate:up`: apply pending migrations (optionally with count)
- `pnpm db:migrate:down`: rollback latest migration (optionally with count)
- `pnpm db:migrate:status`: print applied/pending migration status
- `pnpm db:reset:docker`: reset dockerized DBs (down -v, up -d)
- `pnpm test`: run tests in Vitest
- `pnpm test:watch`: run tests in watch mode
- `pnpm test:run`: run tests once
- `pnpm test:coverage`: run tests with coverage report

## 🔧 Environment Variables

Validated in `src/config/env.ts` using Zod.

- `NODE_ENV`: `development` | `test` | `production` (default: `development`)
- `PORT`: positive integer (default: `3000`)
- `DB_DIALECT`: `postgres` | `mysql` | `mariadb` (default: `postgres`)
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

### Health

- `GET /health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Workspaces

- `GET /api/workspaces`
- `POST /api/workspaces`
- `GET /api/workspaces/:workspaceId`
- `GET /api/workspaces/:workspaceId/members`
- `POST /api/workspaces/:workspaceId/members`
- `PATCH /api/workspaces/:workspaceId/members/:memberUserId`
- `DELETE /api/workspaces/:workspaceId/members/:memberUserId`
- `POST /api/workspaces/:workspaceId/invitations`
- `POST /api/workspaces/join`
- `POST /api/workspaces/:workspaceId/leave`
- `POST /api/workspaces/:workspaceId/convert-to-team`
- `GET /api/workspaces/:workspaceId/updates`

### Collections

- `GET /api/workspaces/:workspaceId/collections`
- `GET /api/workspaces/:workspaceId/collections/:collectionId`
- `POST /api/workspaces/:workspaceId/collections`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId`
- `GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `POST /api/workspaces/:workspaceId/collections/:collectionId/endpoints`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId`
- `GET /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `POST /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples/:exampleId`
- `GET /api/workspaces/:workspaceId/collections/:collectionId/folders`
- `POST /api/workspaces/:workspaceId/collections/:collectionId/folders`
- `PATCH /api/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`
- `DELETE /api/workspaces/:workspaceId/collections/:collectionId/folders/:folderId`

### Environments

- `GET /api/workspaces/:workspaceId/environments`
- `GET /api/workspaces/:workspaceId/environments/:environmentId`
- `POST /api/workspaces/:workspaceId/environments`
- `PATCH /api/workspaces/:workspaceId/environments/:environmentId`
- `DELETE /api/workspaces/:workspaceId/environments/:environmentId`
- `GET /api/workspaces/:workspaceId/environments/:environmentId/variables`
- `GET /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `POST /api/workspaces/:workspaceId/environments/:environmentId/variables`
- `PATCH /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`
- `DELETE /api/workspaces/:workspaceId/environments/:environmentId/variables/:variableId`

### Runs

- `POST /api/workspaces/:workspaceId/runs`
- `GET /api/workspaces/:workspaceId/runs/:runId`
- `POST /api/workspaces/:workspaceId/runs/:runId/cancel`

### Import/Export

- `GET /api/workspaces/:workspaceId/import-export/jobs`
- `GET /api/workspaces/:workspaceId/import-export/jobs/:jobId`
- `POST /api/workspaces/:workspaceId/import-export/exports`
- `POST /api/workspaces/:workspaceId/import-export/imports`

## 📚 Documentation

- `docs/guides/client-integration.md`: full client integration and payload reference
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
