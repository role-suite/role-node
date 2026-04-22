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
- Backward compatibility guarantees follow `docs/api-versioning.md`.
