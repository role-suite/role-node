# SLO and Alerting Policy

## SLO Targets

- Availability SLO: monthly 99.9% for REST/gRPC entry points.
- Error budget: 0.1% monthly.
- Latency SLO: p95 request latency under 300ms for standard operations.
- Reliability SLO: DB query error ratio under 2% (5-minute rolling windows).

## Alert Strategy

- Warning alerts are for early degradation signals and can tolerate short delays.
- Critical alerts indicate active user impact and should page immediately in production.
- Alerts include direct links to runbook sections in `docs/telemetry/runbooks.md`.

## Implemented Alert Rules

- `RoleNodeHighErrorRate` (critical): 5xx ratio > 1% over 10m.
- `RoleNodeLatencyP95High` (warning): p95 latency > 300ms over 15m.
- `RoleNodeLowTrafficOrDown` (warning): near-zero throughput over 10m.
- `RoleNodeEventLoopLagHigh` (warning): event loop lag max > 200ms over 10m.
- `RoleNodeDbErrorRateHigh` (critical): DB query error ratio > 2% over 10m.

Rule source: `config/observability/prometheus/alerts.yml`.

## Routing

- Alertmanager default receiver handles warnings/non-critical alerts.
- Critical alerts are routed to a dedicated `critical` receiver.
- Inhibition suppresses warning duplicates when the same alert is already critical.

## Retention and Cardinality Budgets

- Prometheus retention is capped at 15 days or 5GB, whichever is reached first.
- Loki log retention is 7 days (`168h`) with label/query limits enabled.
- Domain metric operation labels are sanitized to stable, low-cardinality values.

## Local Alert Drill

- Start stack: `pnpm telemetry:up` and app: `pnpm dev`.
- Create normal traffic: `curl -sS http://localhost:3000/health` multiple times.
- Trigger app errors (example): call authenticated routes without token to raise error rate.
- Open Alertmanager UI: `http://localhost:9093` and verify alerts appear with expected `severity` and `slo` labels.
- Confirm each alert includes a runbook link to `docs/telemetry/runbooks.md`.

## Related Docs

- Runbooks: `docs/telemetry/runbooks.md`
- Batch 5 acceptance: `docs/telemetry/batch-5-acceptance.md`
- Batch 6 acceptance: `docs/telemetry/batch-6-acceptance.md`
