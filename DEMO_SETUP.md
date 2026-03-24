# Demo Setup Runbook

This runbook creates a disposable demo database, applies schema migrations, seeds deterministic demo data, and starts the app.

## Prerequisites

- Docker (Docker Desktop or Docker Engine with Compose support)
- Node.js 20+
- pnpm (`pnpm --version`)

## First-time setup

Install dependencies:

```bash
pnpm install
```

## MySQL demo profile

Prepare env values:

```bash
cp .env.demo.mysql .env
```

Start DB:

```bash
docker compose -f docker-compose.demo.mysql.yml up -d
```

## Common flow

Run migrations:

```bash
pnpm db:migrate
```

Seed deterministic demo data:

```bash
pnpm db:seed:demo
```

Start app:

```bash
pnpm dev
```

Login request:

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@role.local","password":"DemoPass123!"}'
```

Expected demo data after login:

- Workspace slug: `role-demo-workspace`
- One collection named `Demo API Collection`
- Two endpoints (`Get Products`, `Create Order`)
- One environment named `Demo` with variables `BASE_URL` and `API_KEY`

## Teardown

```bash
docker compose -f docker-compose.demo.mysql.yml down --remove-orphans
```

The demo compose file uses `tmpfs`, so DB data is not persisted after container removal.
