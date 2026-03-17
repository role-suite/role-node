import { env } from "../config/env.js";

type LogLevel = "info" | "warn" | "error";

const log = (level: LogLevel, message: string, payload?: unknown): void => {
  const entry = {
    level,
    message,
    payload,
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV
  };

  const serialized = JSON.stringify(entry);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  console.log(serialized);
};

export const logger = {
  info: (message: string, payload?: unknown): void => log("info", message, payload),
  warn: (message: string, payload?: unknown): void => log("warn", message, payload),
  error: (message: string, payload?: unknown): void => log("error", message, payload)
};
