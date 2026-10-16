# Release Guide

Releases are automated with [Release Please](https://github.com/googleapis/release-please).
The published artifacts are a GitHub Release and a multi-arch container image on GHCR.

## How a release happens

1. Merge changes to `main` using conventional commit messages (`feat:`, `fix:`, ...).
2. The `Release` workflow opens or updates a release PR (`chore(main): release X.Y.Z`) that bumps
   `package.json` and updates `CHANGELOG.md`.
3. Review the release PR (version bump and changelog entries), then merge it.
4. On that merge, Release Please creates the `vX.Y.Z` tag and GitHub Release, and the same
   workflow chain runs `Publish Image`:
   - verifies the tagged commit (format, lint, typecheck, migrations, tests, build),
   - builds the image, runs the bundled migration CLI against Postgres, boots it and asserts
     `/health`, and fails on fixable HIGH/CRITICAL vulnerabilities,
   - pushes `linux/amd64` + `linux/arm64` to GHCR with SBOM and max provenance attestations.

Versioning policy and API compatibility rules live in `docs/compatibility.md`.

## Published image

- Registry: `ghcr.io/role-suite/role-node`
- Tags: `X.Y.Z` (immutable release), `X.Y` (highest patch of the minor), `latest` (stable
  releases only), `sha-<short>` (commit traceability).

Pull and run:

```bash
docker pull ghcr.io/role-suite/role-node:1.1.0

docker run -d --name role-node \
  --env-file production.env \
  -p 3000:3000 \
  ghcr.io/role-suite/role-node:1.1.0
```

The image is private by default on GHCR. Make it public (package settings → change visibility)
if consumers should pull it anonymously; otherwise `docker login ghcr.io` with a token that has
`read:packages`.

## Migrations

The image bundles the compiled migration CLI, so the exact released artifact can migrate the
database. Run migrations before rolling out new application containers:

```bash
docker run --rm --env-file production.env \
  ghcr.io/role-suite/role-node:1.1.0 \
  node dist-migrations/scripts/migrate.js up

# inspect status
docker run --rm --env-file production.env \
  ghcr.io/role-suite/role-node:1.1.0 \
  node dist-migrations/scripts/migrate.js status

# roll back the latest migration
docker run --rm --env-file production.env \
  ghcr.io/role-suite/role-node:1.1.0 \
  node dist-migrations/scripts/migrate.js down
```

The environment file must provide the `DB_*` variables (see `docs/guides/launch.md`).

## Supply chain

Release images carry signed build provenance and an SBOM attestation. Verify them with the
GitHub CLI before deploying:

```bash
gh attestation verify oci://ghcr.io/role-suite/role-node:1.1.0 --repo role-suite/role-node
```

## Manual re-publish

If publishing fails after a release was created (for example a transient registry error), re-run
it without cutting a new release: Actions → `Publish Image` → Run workflow → enter the existing
tag (`vX.Y.Z`).

## Rollback

- Service rollback: redeploy the previous `X.Y.Z` image tag.
- Schema rollback: only if the application rollback requires it, roll back the affected migration
  with the commands above, then confirm with `status`.
