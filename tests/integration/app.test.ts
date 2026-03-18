import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import { usersRepo } from "../../src/modules/users/users.repo.js";

describe("App integration", () => {
  beforeEach(() => {
    usersRepo.clear();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.headers["x-request-id"]).toBeDefined();
    expect(response.body).toEqual({
      success: true,
      data: { status: "ok" },
    });
  });

  it("creates and fetches a user", async () => {
    const createResponse = await request(app).post("/api/users").send({
      name: "Altay",
      email: "altay@example.com",
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.id).toBe(1);
    expect(createResponse.body.data.email).toBe("altay@example.com");

    const getResponse = await request(app).get("/api/users/1");

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.success).toBe(true);
    expect(getResponse.body.data.name).toBe("Altay");
  });

  it("returns created users in list endpoint", async () => {
    await request(app).post("/api/users").send({
      name: "Alpha",
      email: "alpha@example.com",
    });

    await request(app).post("/api/users").send({
      name: "Beta",
      email: "beta@example.com",
    });

    const listResponse = await request(app).get("/api/users");

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.success).toBe(true);
    expect(listResponse.body.data).toHaveLength(2);
  });

  it("rejects duplicate user emails", async () => {
    await request(app).post("/api/users").send({
      name: "First",
      email: "dup@example.com",
    });

    const duplicateResponse = await request(app).post("/api/users").send({
      name: "Second",
      email: "dup@example.com",
    });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body).toEqual({
      success: false,
      message: "Email already in use",
    });
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request(app).get("/missing");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("returns 400 for invalid create payload", async () => {
    const response = await request(app).post("/api/users").send({
      name: "A",
      email: "not-an-email",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("returns 404 when user does not exist", async () => {
    const response = await request(app).get("/api/users/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "User not found",
    });
  });
});
