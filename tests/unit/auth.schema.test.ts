import { describe, expect, it } from "vitest";

import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../../src/modules/auth/auth.schema.js";

describe("auth schema", () => {
  it("parses valid single-account register payload", () => {
    const payload = registerSchema.parse({
      name: "Altay",
      email: "altay@example.com",
      password: "password123",
      accountType: "single",
    });

    expect(payload.accountType).toBe("single");
  });

  it("requires teamName for team account", () => {
    const result = registerSchema.safeParse({
      name: "Team Owner",
      email: "owner@example.com",
      password: "password123",
      accountType: "team",
    });

    expect(result.success).toBe(false);
  });

  it("parses login payload with email and password", () => {
    const parsed = loginSchema.parse({
      email: "member@example.com",
      password: "password123",
    });

    expect(parsed.email).toBe("member@example.com");
  });

  it("rejects extra fields in login payload", () => {
    const result = loginSchema.safeParse({
      email: "member@example.com",
      password: "password123",
      workspaceId: 12,
    });

    expect(result.success).toBe(false);
  });

  it("accepts refresh token payload", () => {
    const payload = refreshTokenSchema.parse({ refreshToken: "token" });
    expect(payload.refreshToken).toBe("token");
  });
});
