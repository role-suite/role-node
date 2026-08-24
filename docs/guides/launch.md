# Launch Checklist

Phase 9 is a greenfield launch. There is no production data to migrate and no ETL/cutover window to coordinate.

## Required Infrastructure

- Postgres database reachable from the app runtime.
- Runtime target capable of running the published GHCR image.
- HTTP ingress or load balancer routing to container port `3000`.
- DNS record pointing the public API host to the ingress/load balancer.

## Required Runtime Environment

Set these for production:

- `NODE_ENV=production`
- `PORT=3000` unless the platform injects another port.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `DB_SSL=true` when required by the managed Postgres provider.
- `DB_POOL_MIN`, `DB_POOL_MAX` sized for the deployment.
- `ENABLE_STARTUP_VALIDATION=true`
- `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET` with production-only random values.
- `AUTH_ACCESS_TOKEN_TTL_SECONDS`, `AUTH_REFRESH_TOKEN_TTL_SECONDS`

## Deployment Secrets

GitHub Actions deployment requires:

- `PRODUCTION_DEPLOY_WEBHOOK_URL`

Application runtime secrets are provisioned in the target platform, not in GitHub Actions, unless the deployment webhook implementation explicitly pulls them from GitHub environment secrets.

## Launch Sequence

1. Provision an empty Postgres database.
2. Configure production runtime environment variables and secrets.
3. Run `pnpm verify` on the release commit.
4. Run `pnpm db:migrate` against the production database before first traffic.
5. Publish/deploy the image through the CD workflow.
6. Confirm `GET /health` returns `200`.
7. Confirm startup logs include successful startup validation.
8. Point DNS/API routing at the production ingress.
9. Run a smoke check for auth registration/login and a workspace-scoped list route.

## Rollback Notes

- Because this is greenfield, rollback is service/image rollback only unless a newly-applied migration must be reverted before traffic resumes.
- Use `pnpm db:migrate:status` to inspect applied migrations.
- Use `pnpm db:migrate:down [count]` only when the corresponding application rollback requires it.
