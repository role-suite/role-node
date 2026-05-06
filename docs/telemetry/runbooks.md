# Telemetry Runbooks

Dashboards and tools:

- Grafana: `http://localhost:3001`
- Prometheus: `http://localhost:9090`
- Alertmanager: `http://localhost:9093`
- Log/trace correlation fields: `traceId`, `spanId`, `requestId`

## High Error Rate

- Check `Role Node - Telemetry Overview` dashboard for 5xx spikes and affected routes.
- Inspect recent traces in Grafana Tempo for failed requests and shared error attributes.
- Review service logs in Grafana Loki by `traceId` and `requestId` to identify root cause.
- Validate downstream dependencies (DB, external services, gRPC) before rollback/restart.

## High p95 Latency

- Identify whether latency is broad or limited to specific paths in Grafana panels.
- Check `role_service_operation_duration_ms` and `role_db_query_duration_ms` for hotspots.
- Inspect traces for long spans (DB query, external calls, serialization bottlenecks).
- Mitigate by reducing load, scaling, or temporarily disabling heavy code paths.

## Low Traffic or Service Down

- Verify app process health and container state (`docker compose ps`).
- Confirm ingress/proxy routing and port reachability to `PORT` and `GRPC_PORT`.
- Check health endpoint (`GET /health`) and gRPC health if enabled.
- If traffic loss is expected (maintenance), silence alert for approved window.

## High Event Loop Lag

- Check Node process memory and CPU pressure from dashboard/process metrics.
- Inspect traces for synchronous heavy operations and long blocking spans.
- Review recent deploys that may introduce CPU-intensive loops or large payload parsing.
- Mitigate by scaling instances, reducing concurrency, or rolling back recent changes.

## High DB Error Rate

- Inspect DB metrics by dialect and operation from `role_db_queries_total`.
- Validate DB availability, credentials, migrations, and connection pool saturation.
- Check failing SQL patterns in logs/traces and compare against recent schema changes.
- If migration-related, roll back migration or deploy compatibility patch.

## Escalation and Closure

- Escalate critical alerts immediately when user impact is confirmed.
- Keep incident notes with query screenshots, trace IDs, and mitigation timeline.
- Close incident only after alert is resolved and remains stable for at least one full evaluation window.
