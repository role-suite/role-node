# Demo Setup Runbook

This runbook creates a disposable PostgreSQL demo database, applies schema migrations, seeds deterministic demo data, and starts the app.

## Prerequisites

- Docker (Docker Desktop or Docker Engine with Compose support)
- Node.js 20+
- pnpm (`pnpm --version`)

## First-time setup

Install dependencies:

```bash
pnpm install
```

Prepare demo environment values:

```bash
cp .env.demo .env
```

If you already have a personal `.env`, back it up first:

```bash
cp .env .env.backup
cp .env.demo .env
```

## Start demo database

```bash
docker compose -f docker-compose.demo.yml up -d
```

Wait for health status to become `healthy`:

```bash
docker ps
```

## Run migrations

```bash
pnpm db:migrate
```

## Seed demo data

```bash
pnpm db:seed:demo
```

Seed output includes the demo login credentials and generated IDs.

## Start app

```bash
pnpm dev
```

## Verify sample login and data

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

## Shutdown and cleanup

Stop and remove demo container:

```bash
docker compose -f docker-compose.demo.yml down --remove-orphans
```

If persistent volumes are added in the future, remove them too:

```bash
docker compose -f docker-compose.demo.yml down -v --remove-orphans
```

Optional: restore your previous local environment file:

```bash
mv .env.backup .env
```

## Verify teardown behavior

After shutdown, start the DB again and check that data is gone:

```bash
docker compose -f docker-compose.demo.yml up -d
pnpm db:migrate:status
```

Expected: migration status reports all migrations as pending until you run `pnpm db:migrate` again.

## Troubleshooting

Port 5432 already in use:

- Stop local PostgreSQL service/container using port 5432.
- Or change host port mapping in `docker-compose.demo.yml` and update `DATABASE_URL` in `.env.demo`.

Container not healthy yet:

- Give Docker a few more seconds and retry `docker ps`.
- Check logs with `docker compose -f docker-compose.demo.yml logs demo-db`.

Migration failure:

- Confirm `.env` currently contains demo DB values (`DB_DIALECT=postgres`, `DATABASE_URL=postgresql://role:role@localhost:5432/role_demo`).
- Ensure container is running and healthy.
- Retry `pnpm db:migrate`.

Seed failure:

- Ensure migrations were applied before seeding.
- Rerun `pnpm db:seed:demo` after fixing DB connectivity.
