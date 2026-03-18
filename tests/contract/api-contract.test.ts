import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";

import { app } from "../../src/app.js";
import { usersRepo } from "../../src/modules/users/users.repo.js";

const healthResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    status: z.literal("ok"),
  }),
});

const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2),
  email: z.email(),
  createdAt: z.string().datetime(),
});

const successEnvelopeSchema = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.object({
    success: z.literal(true),
    data: schema,
  });

describe("API contract", () => {
  beforeEach(() => {
    usersRepo.clear();
  });

  it("keeps /health response contract stable", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(() => healthResponseSchema.parse(response.body)).not.toThrow();
  });

  it("keeps create and get user contracts stable", async () => {
    const createResponse = await request(app).post("/api/users").send({
      name: "Contract User",
      email: "contract@example.com",
    });

    expect(createResponse.status).toBe(201);
    expect(() =>
      successEnvelopeSchema(userSchema).parse(createResponse.body),
    ).not.toThrow();

    const userId = createResponse.body.data.id;
    const getResponse = await request(app).get(`/api/users/${userId}`);

    expect(getResponse.status).toBe(200);
    expect(() =>
      successEnvelopeSchema(userSchema).parse(getResponse.body),
    ).not.toThrow();
  });

  it("keeps list users contract stable", async () => {
    await request(app)
      .post("/api/users")
      .send({ name: "One", email: "one@example.com" });
    await request(app)
      .post("/api/users")
      .send({ name: "Two", email: "two@example.com" });

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(() =>
      successEnvelopeSchema(z.array(userSchema)).parse(response.body),
    ).not.toThrow();
  });
});
