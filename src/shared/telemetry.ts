import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  PeriodicExportingMetricReader,
  type MetricReader,
} from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  AlwaysOffSampler,
  AlwaysOnSampler,
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
  type Sampler,
} from "@opentelemetry/sdk-trace-base";

import { env } from "../config/env.js";

import { logger } from "./logger.js";

let telemetrySdk: NodeSDK | null = null;

const buildMetricsReader = (): MetricReader => {
  return new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
    }),
    exportIntervalMillis: env.OTEL_METRICS_EXPORT_INTERVAL_MS,
  });
};

export const buildTraceSampler = (): Sampler => {
  if (env.OTEL_TRACES_SAMPLER === "always_off") {
    return new AlwaysOffSampler();
  }

  if (env.OTEL_TRACES_SAMPLER === "ratio") {
    return new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(env.OTEL_TRACES_SAMPLER_RATIO),
    });
  }

  return new AlwaysOnSampler();
};

export const startTelemetry = async (): Promise<void> => {
  if (!env.OTEL_ENABLED || telemetrySdk) {
    return;
  }

  if (env.NODE_ENV !== "production") {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);
  }

  telemetrySdk = new NodeSDK({
    resource: resourceFromAttributes({
      "service.name": env.OTEL_SERVICE_NAME,
      "service.version": env.OTEL_SERVICE_VERSION,
      "deployment.environment.name": env.NODE_ENV,
    }),
    traceExporter: new OTLPTraceExporter({
      url: `${env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    }),
    sampler: buildTraceSampler(),
    metricReader: buildMetricsReader(),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": {
          enabled: false,
        },
      }),
    ],
  });

  await telemetrySdk.start();
  logger.info("OpenTelemetry initialized", {
    serviceName: env.OTEL_SERVICE_NAME,
    endpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
    sampler: env.OTEL_TRACES_SAMPLER,
    samplerRatio:
      env.OTEL_TRACES_SAMPLER === "ratio"
        ? env.OTEL_TRACES_SAMPLER_RATIO
        : undefined,
  });
};

export const shutdownTelemetry = async (): Promise<void> => {
  if (!telemetrySdk) {
    return;
  }

  await telemetrySdk.shutdown();
  telemetrySdk = null;
  logger.info("OpenTelemetry shutdown complete");
};
