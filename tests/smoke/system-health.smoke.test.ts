import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../../src/app.js";

describe("system smoke", () => {
  it("serves health endpoint", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("responds with JSON content type", async () => {
    const response = await request(app).get("/health");
    expect(response.headers["content-type"]).toContain("application/json");
  });
});
