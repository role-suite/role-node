import { metrics, SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("role-node.domain");
const meter = metrics.getMeter("role-node.domain");

const operationDurationMs = meter.createHistogram("role_service_operation_duration_ms", {
  description: "Duration of service-layer operations in milliseconds",
  unit: "ms",
});

const authOperationsTotal = meter.createCounter("role_auth_operations_total", {
  description: "Count of auth operations by type and outcome",
});

const workspaceOperationsTotal = meter.createCounter("role_workspace_operations_total", {
  description: "Count of workspace operations by type and outcome",
});

const runOperationsTotal = meter.createCounter("role_run_operations_total", {
  description: "Count of run operations by type and outcome",
});

const importExportOperationsTotal = meter.createCounter("role_import_export_operations_total", {
  description: "Count of import/export operations by type and outcome",
});

type ServiceName = "auth" | "workspaces" | "runs" | "import_export";

const OPERATION_PATTERN = /^[a-z0-9_]{1,40}$/;

export const sanitizeMetricLabelValue = (value: string): string => {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

  if (!OPERATION_PATTERN.test(normalized)) {
    return "other";
  }

  return normalized;
};

export const recordDomainMetric = {
  auth: (operation: string, outcome: "success" | "error"): void => {
    authOperationsTotal.add(1, {
      operation: sanitizeMetricLabelValue(operation),
      outcome,
    });
  },
  workspace: (operation: string, outcome: "success" | "error"): void => {
    workspaceOperationsTotal.add(1, {
      operation: sanitizeMetricLabelValue(operation),
      outcome,
    });
  },
  run: (
    operation: string,
    outcome: "success" | "error",
    sourceType?: "adhoc" | "collectionEndpoint",
  ): void => {
    runOperationsTotal.add(1, {
      operation: sanitizeMetricLabelValue(operation),
      outcome,
      ...(sourceType ? { source_type: sourceType } : {}),
    });
  },
  importExport: (
    operation: string,
    outcome: "success" | "error",
    jobType?: "import" | "export",
  ): void => {
    importExportOperationsTotal.add(1, {
      operation: sanitizeMetricLabelValue(operation),
      outcome,
      ...(jobType ? { job_type: jobType } : {}),
    });
  },
};

export const withDomainSpan = async <T>(
  service: ServiceName,
  operation: string,
  attributes: Record<string, string | number | boolean | undefined>,
  callback: () => Promise<T>,
): Promise<T> => {
  const operationLabel = sanitizeMetricLabelValue(operation);
  const startedAt = process.hrtime.bigint();

  return tracer.startActiveSpan(`${service}.${operation}`, async (span) => {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        span.setAttribute(key, value);
      }
    });

    try {
      const result = await callback();
      span.setStatus({ code: SpanStatusCode.OK });
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      operationDurationMs.record(durationMs, {
        service,
        operation: operationLabel,
        outcome: "success",
      });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      operationDurationMs.record(durationMs, {
        service,
        operation: operationLabel,
        outcome: "error",
      });
      throw error;
    } finally {
      span.end();
    }
  });
};
