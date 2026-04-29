import { Metadata } from "@grpc/grpc-js";
import { describe, expect, it } from "vitest";

import { env } from "../../src/config/env.js";
import { resolveAccessTokenPayload } from "../../src/grpc/interceptors/auth-metadata.js";
import { createAuthToken } from "../../src/shared/auth/tokens.js";
import { AppError } from "../../src/shared/errors/app-error.js";

describe("grpc auth metadata", () => {
  it("parses bearer token payload", () => {
    const token = createAuthToken({
      userId: 1,
      workspaceId: 2,
      sessionId: 3,
      type: "access",
      ttlSeconds: 60,
      secret: env.AUTH_ACCESS_TOKEN_SECRET,
    });

    const metadata = new Metadata();
    metadata.set("authorization", `Bearer ${token}`);

    const payload = resolveAccessTokenPayload(metadata);

    expect(payload.sub).toBe(1);
    expect(payload.wid).toBe(2);
    expect(payload.sid).toBe(3);
  });

  it("throws AppError for missing bearer token", () => {
    const metadata = new Metadata();

    expect(() => resolveAccessTokenPayload(metadata)).toThrow(AppError);
  });
});
