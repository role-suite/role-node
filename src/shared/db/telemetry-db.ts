import { metrics, SpanStatusCode, trace } from "@opentelemetry/api";

import type { DbDialect } from "../../types/db.js";

const tracer = trace.getTracer("role-node.db");
const meter = metrics.getMeter("role-node.db");

const dbQueryDurationMs = meter.createHistogram("role_db_query_duration_ms", {
  description: "Database query duration in milliseconds",
  unit: "ms",
});

const dbQueriesTotal = meter.createCounter("role_db_queries_total", {
  description: "Total database queries by dialect, operation and outcome",
});

const extractSqlOperation = (sql: string): string => {
  const normalized = sql.trim().split(/\s+/)[0]?.toUpperCase();
  return normalized && normalized.length > 0 ? normalized : "UNKNOWN";
};

export const withDbQueryTelemetry = async <T>(
  dialect: DbDialect,
  sql: string,
  paramsCount: number,
  callback: () => Promise<T>,
): Promise<T> => {
  const operation = extractSqlOperation(sql);
  const startedAt = process.hrtime.bigint();

  return tracer.startActiveSpan("db.query", async (span) => {
    span.setAttribute("db.system", dialect);
    span.setAttribute("db.operation.name", operation);
    span.setAttribute("db.query.parameter_count", paramsCount);

    try {
      const result = await callback();
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      dbQueryDurationMs.record(durationMs, {
        dialect,
        operation,
        outcome: "success",
      });
      dbQueriesTotal.add(1, {
        dialect,
        operation,
        outcome: "success",
      });
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      dbQueryDurationMs.record(durationMs, {
        dialect,
        operation,
        outcome: "error",
      });
      dbQueriesTotal.add(1, {
        dialect,
        operation,
        outcome: "error",
      });
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
};
