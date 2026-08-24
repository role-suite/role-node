# Compatibility Matrix

This table tells API consumers which repository versions are validated to work together.

Update this table on every release.

## Version compatibility

| role-node version   | supported role-sdk versions | supported role-client versions |
| ------------------- | --------------------------- | ------------------------------ |
| `main` (unreleased) | `main`                      | `main`                         |
| `1.0.x`             | `1.0.x`                     | `1.0.x`                        |

## Notes

- If your project is pinned to a release tag (for example `v1.0.0`), use the matching major/minor line.
- If you consume unreleased changes from `main`, use `main` for `role-sdk` and `role-client` as well.
- Keep role-node, role-sdk, and role-client on matching major/minor versions unless a release note states otherwise.

## API URL versioning

All REST routes are mounted under `/api/v1` (`API_PREFIX` in `src/shared/routes.ts`).

This exists for a different reason than the table above: the table tracks compatibility between
this repo and the two clients built and released alongside it in lockstep. `/api/v1` exists
because those aren't the only consumers going forward — a published mobile/desktop app (Flutter,
one codebase across iOS/Android/Windows/Linux/macOS) has installs that keep calling the API for
weeks or months after a new server version ships (app store review lag, users who don't update,
offline installs). Once such a client exists, "ship a breaking change and update the client at
the same time" is no longer guaranteed, so the URL needs its own version seam independent of the
role-sdk/role-client release cadence above.

Policy:

- Bump to `/api/v2` only for an actual breaking change: a removed/renamed response field, a
  changed status code or auth flow, a removed endpoint — anything that would break a client
  written against `/api/v1` responses as documented today.
- Additive changes (a new optional request field, a new response field, a new endpoint) do
  **not** require a version bump; they stay on `/api/v1`.
- When `/api/v2` is cut, `/api/v1` keeps running until every known client (including installed
  mobile/desktop app versions still in the field) has had a realistic window to move off it —
  don't retire `/api/v1` on the same release that introduces `/api/v2`.
