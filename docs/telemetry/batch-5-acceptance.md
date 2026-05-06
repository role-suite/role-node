# Batch 5 Acceptance Checklist

## Security Controls

- [x] Application-side telemetry redaction masks sensitive keys before logging.
- [x] Collector-side attribute redaction removes sensitive attributes from traces/metrics/logs.
- [x] Tests verify raw secret values are not emitted in production logs.

## Sampling Controls

- [x] Head sampler is configurable through environment variables.
- [x] Ratio sampler validates range bounds (0 to 1).
- [x] Collector tail sampling prioritizes error and slow traces.

## Cost and Retention Controls

- [x] Prometheus retention is capped by time and size budget.
- [x] Loki retention and query limits are explicitly configured.
- [x] Metric label sanitization reduces cardinality risk for dynamic values.

## Verification

- [x] Targeted telemetry security/sampling tests pass.
- [x] Full test suite passes after all Batch 5 changes.

## Evidence

- Redaction utility: `src/shared/telemetry-redaction.ts`
- Sampler strategy: `src/shared/telemetry.ts`
- Collector redaction + tail sampling: `config/observability/otel-collector/config.yaml`
- Retention/cardinality controls: `docker-compose.yml`, `config/observability/loki/loki.yaml`, `src/shared/telemetry-domain.ts`
