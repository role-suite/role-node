# Demo DB Implementation Todo (Docker + Dummy Data + Auto Cleanup)

This checklist is designed for a **ready-to-use demo environment** where:

- The database runs in Docker.
- Demo data can be seeded repeatedly.
- The database is removed cleanly after the demo.

The plan is aligned with the current project setup (`pnpm`, migration runner, PostgreSQL support).

---

## 1) Create an ephemeral PostgreSQL Docker setup

### Goal

Run a local PostgreSQL instance dedicated to demos, with no persistent data left after shutdown.

### File

- `docker-compose.demo.yml`

### Tasks

- Define a `demo-db` service using `postgres:16-alpine`.
- Set environment variables:
  - `POSTGRES_USER=role`
  - `POSTGRES_PASSWORD=role`
  - `POSTGRES_DB=role_demo`
- Expose port `5432:5432`.
- Add a healthcheck using `pg_isready`.
- Mount DB data directory as `tmpfs` (`/var/lib/postgresql/data`) so data is in-memory and disappears after container removal.

### Why this matters

- `tmpfs` avoids persistent volume cleanup complexity.
- Demo resets are fast.
- No leftover data risk after the demo closes.

### Acceptance criteria

- `docker compose -f docker-compose.demo.yml up -d` starts successfully.
- `docker ps` shows container healthy after startup.

---

## 2) Add demo environment configuration

### Goal

Point the app and migration scripts to the demo DB without changing normal development settings.

### File

- Prefer: `.env.demo`
- Optional: document equivalent values in `.env.example` notes

### Required variables

- `DB_DIALECT=postgres`
- `DATABASE_URL=postgresql://role:role@localhost:5432/role_demo`
- `DB_POOL_MIN=0`
- `DB_POOL_MAX=10`
- `DB_SSL=false`

### Tasks

- Add `.env.demo` with full DB block.
- Document how to copy values to `.env` (if project currently reads only `.env`).

### Why this matters

- Keeps demo config isolated.
- Prevents accidental use of production or personal dev DB.

### Acceptance criteria

- Migration command works against demo DB with this configuration.

---

## 3) Build a deterministic seed script

### Goal

Fill the DB with realistic demo data that is always the same and can be recreated quickly.

### File

- `scripts/seed-demo.ts`

### Tasks

- Reuse existing DB client creation approach used in `scripts/migrate.ts`.
- Validate required env vars at startup.
- Open a transaction for full seed operation.
- Insert minimum meaningful dataset:
  - one demo user
  - one workspace
  - one membership (`owner`)
  - one collection
  - one or more endpoints
  - one environment
  - one or more environment variables
- Use static values (no random/faker data).
- Close DB connection in `finally`.

### Why this matters

- Predictable demos are easier to present and test.
- Transactional seed avoids partial data when something fails.

### Acceptance criteria

- `pnpm db:seed:demo` runs with no errors.
- Expected demo rows appear in tables.

---

## 4) Make seeding idempotent (safe to re-run)

### Goal

Allow reseeding any time without manual cleanup or duplicate rows.

### Tasks

- At seed start, clear demo tables in FK-safe order using:
  - `TRUNCATE ... RESTART IDENTITY CASCADE` (PostgreSQL)
- Keep all inserts after truncate in the same transaction.

### Why this matters

- You can run seed repeatedly before each demo.
- IDs remain stable due to identity reset.

### Acceptance criteria

- Running `pnpm db:seed:demo` multiple times always ends with same dataset and same IDs.

---

## 5) Expose seed command via `package.json`

### Goal

One command for team members and presenters.

### File

- `package.json`

### Tasks

- Add script:
  - `"db:seed:demo": "tsx scripts/seed-demo.ts"`

### Why this matters

- Standardized onboarding and demo workflow.

### Acceptance criteria

- `pnpm db:seed:demo` is available and executes successfully.

---

## 6) Add a detailed runbook for presenters

### Goal

Make setup executable by anyone in a few minutes.

### File

- `DEMO_SETUP.md`

### Required sections

- Prerequisites (`Docker`, `pnpm`, Node version)
- First-time setup
- Start DB
- Run migrations
- Seed demo data
- Start app
- Verify sample login/data
- Shutdown and cleanup
- Troubleshooting (port conflicts, healthcheck delay, migration failure)

### Command flow to document

```bash
docker compose -f docker-compose.demo.yml up -d
pnpm db:migrate
pnpm db:seed:demo
pnpm dev
```

Cleanup:

```bash
docker compose -f docker-compose.demo.yml down --remove-orphans
```

If persistent volume is ever used later, include note:

```bash
docker compose -f docker-compose.demo.yml down -v --remove-orphans
```

### Why this matters

- Removes tribal knowledge.
- Makes the demo reproducible for teammates and stakeholders.

### Acceptance criteria

- A teammate can follow only `DEMO_SETUP.md` and run demo end-to-end.

---

## 7) End-to-end verification

### Goal

Confirm implementation works as a complete flow.

### Tasks

- Start DB container.
- Run migrations.
- Run seed.
- Start app and test basic API/UI paths.

### Validation checklist

- Migration output reports expected applied migrations.
- Seed script exits successfully.
- Demo user/workspace/data are visible through app behavior.

### Acceptance criteria

- Full flow runs without manual SQL or ad-hoc fixes.

---

## 8) Verify teardown behavior (data is actually deleted)

### Goal

Ensure the demo environment leaves no data behind after closure.

### Tasks

- Run:
  - `docker compose -f docker-compose.demo.yml down --remove-orphans`
- Start container again.
- Check DB starts empty (before migrations/seed).

### Why this matters

- Matches requirement: DB should be deleted after project/demo is closed.

### Acceptance criteria

- Previous demo data is not present after restart.
- Fresh migration + seed produces clean state.

---

## 9) Recommended execution order

1. `docker-compose.demo.yml`
2. `.env.demo`
3. `scripts/seed-demo.ts`
4. `package.json` script entry
5. `DEMO_SETUP.md`
6. End-to-end verification
7. Teardown verification

---

## 10) Definition of done

Implementation is complete when all of the following are true:

- Demo DB starts with one command.
- Migrations run successfully on demo DB.
- Seed command reliably creates deterministic demo data.
- Seed is idempotent.
- App can run using this dataset.
- One teardown command removes DB and demo data.
- Documentation is clear enough for another teammate to run without guidance.
