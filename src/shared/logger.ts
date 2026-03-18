import { env } from "../config/env.js";

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const minLevel: LogLevel = env.NODE_ENV === "production" ? "info" : "debug";

const shouldLog = (level: LogLevel): boolean => {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minLevel];
};

const normalizePayload = (payload: unknown): unknown => {
  if (payload instanceof Error) {
    return {
      name: payload.name,
      message: payload.message,
      stack: payload.stack,
    };
  }

  return payload;
};

const logDevelopment = (
  level: LogLevel,
  message: string,
  payload: unknown,
): void => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] ${level.toUpperCase()} ${message}`;

  if (payload === undefined) {
    if (level === "error") {
      console.error(prefix);
      return;
    }

    console.log(prefix);
    return;
  }

  if (level === "error") {
    console.error(prefix, payload);
    return;
  }

  console.log(prefix, payload);
};

const logProduction = (
  level: LogLevel,
  message: string,
  payload: unknown,
): void => {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
    pid: process.pid,
    payload,
  };

  const serialized = JSON.stringify(entry);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  console.log(serialized);
};

const log = (level: LogLevel, message: string, payload?: unknown): void => {
  if (!shouldLog(level)) {
    return;
  }

  const normalizedPayload = normalizePayload(payload);

  if (env.NODE_ENV === "production") {
    logProduction(level, message, normalizedPayload);
    return;
  }

  logDevelopment(level, message, normalizedPayload);
};

export const logger = {
  debug: (message: string, payload?: unknown): void =>
    log("debug", message, payload),
  info: (message: string, payload?: unknown): void =>
    log("info", message, payload),
  warn: (message: string, payload?: unknown): void =>
    log("warn", message, payload),
  error: (message: string, payload?: unknown): void =>
    log("error", message, payload),
};
