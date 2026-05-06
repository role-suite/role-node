# Batch 6 Acceptance Checklist

## CI Telemetry Smoke Checks

- [x] CI includes a dedicated telemetry gate (`4.5 Telemetry`).
- [x] Telemetry smoke tests run in CI via `pnpm telemetry:test`.
- [x] Telemetry config validation runs in CI via `pnpm telemetry:validate`.

## Config Validation Gates

- [x] `docker compose config` validation is executed.
- [x] Prometheus alert rules are validated with `promtool check rules`.
- [x] Alertmanager configuration is validated with `amtool check-config`.

## Release/PR Gating

- [x] `CI Status` requires telemetry job success.
- [x] Project-level `verify` command includes `verify:telemetry`.
- [x] Telemetry script and workflow coverage are tested.

## Evidence

- CI telemetry gate: `.github/workflows/ci.yml`
- Telemetry verification scripts: `package.json`
- Workflow guard tests: `tests/unit/ci-telemetry-workflow.test.ts`

## Operator Commands

- Run telemetry smoke tests locally: `pnpm telemetry:test`
- Validate telemetry configs locally: `pnpm telemetry:validate`
- Run all quality gates including telemetry: `pnpm verify`
