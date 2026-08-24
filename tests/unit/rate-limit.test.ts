import express from "express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("rate limit middleware", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.doUnmock("../../src/config/env.js");
  });

  it("returns 429 with a standard error envelope once the limit is exceeded", async () => {
    vi.doMock("../../src/config/env.js", () => ({
      env: {
        NODE_ENV: "development",
        RATE_LIMIT_WINDOW_MS: 60_000,
        RATE_LIMIT_MAX: 2,
        AUTH_RATE_LIMIT_WINDOW_MS: 60_000,
        AUTH_RATE_LIMIT_MAX: 2,
      },
    }));

    const { apiRateLimiter } =
      await import("../../src/shared/middleware/rate-limit.js");

    const app = express();
    app.use(apiRateLimiter);
    app.get("/probe", (_req, res) => {
      res.status(200).json({ success: true });
    });

    await request(app).get("/probe").expect(200);
    await request(app).get("/probe").expect(200);

    const response = await request(app).get("/probe");

    expect(response.status).toBe(429);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "RATE_LIMIT_EXCEEDED",
        }),
      }),
    );
  });

  it("does not rate limit requests when NODE_ENV is test", async () => {
    vi.doMock("../../src/config/env.js", () => ({
      env: {
        NODE_ENV: "test",
        RATE_LIMIT_WINDOW_MS: 60_000,
        RATE_LIMIT_MAX: 1,
        AUTH_RATE_LIMIT_WINDOW_MS: 60_000,
        AUTH_RATE_LIMIT_MAX: 1,
      },
    }));

    const { apiRateLimiter } =
      await import("../../src/shared/middleware/rate-limit.js");

    const app = express();
    app.use(apiRateLimiter);
    app.get("/probe", (_req, res) => {
      res.status(200).json({ success: true });
    });

    await request(app).get("/probe").expect(200);
    await request(app).get("/probe").expect(200);
    await request(app).get("/probe").expect(200);
  });
});
