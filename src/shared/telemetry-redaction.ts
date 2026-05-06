const REDACTED = "[REDACTED]";

const SENSITIVE_KEYWORDS = [
  "password",
  "secret",
  "token",
  "authorization",
  "api_key",
  "apikey",
  "refresh",
  "access",
  "cookie",
];

const isSensitiveKey = (key: string): boolean => {
  const normalized = key.toLowerCase();
  return SENSITIVE_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const redactValue = (value: unknown, seen: WeakSet<object>): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, seen));
  }

  if (value && typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular]";
    }

    seen.add(value);

    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};

    Object.entries(input).forEach(([key, nestedValue]) => {
      if (isSensitiveKey(key)) {
        output[key] = REDACTED;
        return;
      }

      output[key] = redactValue(nestedValue, seen);
    });

    return output;
  }

  return value;
};

export const redactTelemetryPayload = (payload: unknown): unknown => {
  return redactValue(payload, new WeakSet<object>());
};
