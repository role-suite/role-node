<p align="center">
  <img src="assets/app_logo.png" alt="Röle Logo" width="120" height="120">
</p>

<h1 align="center">Röle Node</h1>

<p align="center">
  <a href="https://github.com/role-suite/role-node/actions/workflows/ci.yml"><img src="https://github.com/role-suite/role-node/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/role-suite/role-node/actions/workflows/codeql.yml"><img src="https://github.com/role-suite/role-node/actions/workflows/codeql.yml/badge.svg" alt="CodeQL"></a>
  <a href="https://github.com/role-suite/role-node/blob/main/badges/coverage.svg"><img src="https://raw.githubusercontent.com/role-suite/role-node/main/badges/coverage.svg" alt="Coverage"></a>
</p>

<p align="center">
  <strong>TypeScript + Express backend with REST + gRPC transports for workspaces, collections, environments, and request runs</strong>
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
  role-node is a modular backend starter built with Express 5 and TypeScript. It provides workspace-based functionality over both REST and gRPC transports for collections, environments, and runnable HTTP requests, with strict schema validation and consistent error handling. It targets Postgres or MySQL with migration support and a tested module structure.
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
- `pnpm contracts:generate`: generate the contract snapshot artifact
- `pnpm contracts:check`: fail when contract snapshot is stale
- `pnpm contracts:breaking-check`: fail on incompatible contract changes vs base ref
- `pnpm contracts:docs-check`: require docs updates when contract artifacts change
- `pnpm contracts:openapi:generate`: generate `contracts/generated/openapi.json`
- `pnpm contracts:openapi:check`: fail when OpenAPI artifact is stale
- `pnpm contracts:openapi:lint`: lint OpenAPI artifact governance requirements
- `pnpm grpc:generate`: generate gRPC type artifacts from `proto/*.proto`
- `pnpm grpc:check`: fail when generated gRPC artifacts are stale
- `pnpm grpc:bundle`: create versioned proto bundle artifact for SDK consumers
- `pnpm grpc:test`: run gRPC unit + integration tests
- `pnpm grpc:test:integration`: run gRPC integration tests only
- `pnpm verify:grpc`: run gRPC artifact + gRPC test checks
- `pnpm verify`: run local integrity gate (format, lint, typecheck, test, build, contracts)

## 🚀 CI/CD

- `CI` workflow (`.github/workflows/ci.yml`) runs on pull requests and pushes to `main` and `v*` tags.
- It runs ordered quality gates as separate checks: `1. Format`, `2. Lint`, `3. Contract Check`, `4. Test`, `5. Build`, then a required `CI Status` gate.
- `Contract Check` verifies both `contracts/generated/public-api.snapshot.json` and `contracts/generated/openapi.json` are regenerated and valid.
- `Contract Check` also validates gRPC artifact drift with `pnpm grpc:check`.
- `Security` workflow (`.github/workflows/security.yml`) runs dependency audit and gitleaks secret scanning.
- `CodeQL` workflow (`.github/workflows/codeql.yml`) runs static analysis for Actions and JavaScript/TypeScript.
- `Coverage Badge` workflow (`.github/workflows/coverage-badge.yml`) updates `badges/coverage.svg` on pushes to `main`.
- `CD` workflow (`.github/workflows/cd.yml`) builds and publishes Docker images to GHCR and deploys production from `v*` tags or manual dispatch.
- CD is gated by `CI / CI Status` on the exact same commit SHA before publishing/deploying.
- `Release` workflow (`.github/workflows/release-tag.yml`) performs semantic versioning from manual dispatch (`patch`, `minor`, `major`): it runs quality gates, bumps `package.json`, updates `CHANGELOG.md`, creates a `v*` tag, and creates the GitHub Release.
- `Test` gate runs both `pnpm test:run` and `pnpm grpc:test` to enforce transport-level confidence.

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
- `GRPC_ENABLED`: `true` | `false` (default: `false`)
- `GRPC_PORT`: positive integer (default: `50051`)
- `GRPC_TLS_ENABLED`: `true` | `false` (default: `false`)
- `GRPC_MTLS_ENABLED`: `true` | `false` (default: `false`)
- `GRPC_TLS_CERT_PATH`: required when `GRPC_TLS_ENABLED=true`
- `GRPC_TLS_KEY_PATH`: required when `GRPC_TLS_ENABLED=true`
- `GRPC_TLS_CA_PATH`: required when `GRPC_MTLS_ENABLED=true`
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
When `GRPC_ENABLED=true`, the app also starts a gRPC server with `HealthService/Check` on `GRPC_PORT`.

## 🛰️ gRPC Services

Current gRPC services (package `role.v1`):

- `HealthService`: `Check`
- `AuthService`: `Register`, `Login`, `Refresh`, `Logout`, `Me`
- `WorkspacesService`: workspace/member/invitation/update operations
- `CollectionsService`: collections/endpoints/folders/examples operations
- `EnvironmentsService`: environments/variables operations
- `RunsService`: `Create`, `GetById`, `Cancel`
- `ImportExportService`: `ListJobs`, `GetJobById`, `CreateExportJob`, `CreateImportJob`

Transport notes:

- Rich payloads for runs and import-export currently use JSON string fields in proto messages (`payload_json`, `run_json`, `job_json`, `jobs_json`) to preserve parity with existing service DTOs.
- Validate proto drift with `pnpm grpc:check` and run gRPC tests with `pnpm grpc:test`.
- For hardening and compatibility policy, see `docs/guides/grpc-hardening.md`.
- For SDK proto consumption workflow, see `docs/guides/grpc-proto-distribution.md`.
- For SDK metadata/error contract, see `docs/guides/grpc-sdk-integration-contract.md`.

## 🧭 API Overview

This section lists REST endpoints. Equivalent gRPC APIs are available in package `role.v1` and defined under `proto/*.proto`.

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
- `docs/guides/grpc-proto-distribution.md`: proto tag pinning workflow for SDK consumers
- `docs/guides/grpc-sdk-integration-contract.md`: gRPC metadata and error mapping contract for SDKs
- `docs/guides/grpc-sdk-readiness.md`: SDK readiness checklist for gRPC adoption
- `docs/guides/grpc-transport-parity.md`: REST/gRPC parity expectations and known differences
- `docs/api-versioning.md`: API versioning rules and compatibility policy
- `docs/compatibility.md`: role-node / role-sdk / role-client compatibility matrix
- `docs/errors.md`: machine-readable error model and code registry
- `docs/route-audit.md`: route registry audit and drift alignment notes
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
