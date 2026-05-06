import { describe, expect, it } from "vitest";

import { redactTelemetryPayload } from "../../src/shared/telemetry-redaction.js";

describe("telemetry redaction", () => {
  it("redacts known sensitive keys recursively", () => {
    const input = {
      email: "user@example.com",
      password: "plain-secret",
      nested: {
        accessToken: "access-raw",
        authorization: "Bearer token",
        profile: {
          apiKey: "api-raw",
        },
      },
      items: [
        {
          refreshToken: "refresh-raw",
        },
      ],
    };

    expect(redactTelemetryPayload(input)).toEqual({
      email: "user@example.com",
      password: "[REDACTED]",
      nested: {
        accessToken: "[REDACTED]",
        authorization: "[REDACTED]",
        profile: {
          apiKey: "[REDACTED]",
        },
      },
      items: [
        {
          refreshToken: "[REDACTED]",
        },
      ],
    });
  });

  it("keeps non-sensitive values untouched", () => {
    const input = {
      userId: 42,
      operation: "login",
      ok: true,
    };

    expect(redactTelemetryPayload(input)).toEqual(input);
  });

  it("redacts keys containing sensitive substrings", () => {
    const input = {
      user_token_value: "abc",
      authSecretHint: "def",
      nested: {
        cookieHeader: "ghi",
      },
    };

    expect(redactTelemetryPayload(input)).toEqual({
      user_token_value: "[REDACTED]",
      authSecretHint: "[REDACTED]",
      nested: {
        cookieHeader: "[REDACTED]",
      },
    });
  });

  it("handles circular payloads without throwing or leaking tokens", () => {
    const input: Record<string, unknown> = {
      label: "root",
      accessToken: "raw-token",
    };
    input.self = input;

    expect(redactTelemetryPayload(input)).toEqual({
      label: "root",
      accessToken: "[REDACTED]",
      self: "[Circular]",
    });
  });

  it("handles mixed arrays and null values", () => {
    const input = {
      events: [null, "ok", { refresh_token: "r1" }, ["x", { apiKey: "k" }]],
    };

    expect(redactTelemetryPayload(input)).toEqual({
      events: [null, "ok", { refresh_token: "[REDACTED]" }, ["x", { apiKey: "[REDACTED]" }]],
    });
  });
});
