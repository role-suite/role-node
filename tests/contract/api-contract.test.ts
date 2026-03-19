import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";

import { app } from "../../src/app.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { createAuthTestDb } from "../helpers/auth-test-db.js";

const testDb = createAuthTestDb();

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
});

const authResponseSchema = z.object({
  user: userSchema,
  workspace: z.object({
    id: z.number().int().positive(),
    name: z.string().min(2),
    slug: z.string().min(1),
    type: z.enum(["personal", "team"]),
    role: z.enum(["owner", "admin", "member"]),
  }),
  memberships: z.array(
    z.object({
      workspaceId: z.number().int().positive(),
      name: z.string().min(2),
      slug: z.string().min(1),
      type: z.enum(["personal", "team"]),
      role: z.enum(["owner", "admin", "member"]),
    }),
  ),
  tokens: z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    accessTokenTtlSeconds: z.number().int().positive(),
    refreshTokenTtlSeconds: z.number().int().positive(),
  }),
});

const successEnvelopeSchema = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.object({
    success: z.literal(true),
    data: schema,
  });

describe("API contract", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
  });

  it("keeps /health response contract stable", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(() => healthResponseSchema.parse(response.body)).not.toThrow();
  });

  it("keeps auth register contract stable", async () => {
    const createResponse = await request(app).post("/api/auth/register").send({
      name: "Contract User",
      email: "contract@example.com",
      password: "password123",
      accountType: "single",
    });

    expect(createResponse.status).toBe(201);
    expect(() =>
      successEnvelopeSchema(authResponseSchema).parse(createResponse.body),
    ).not.toThrow();
  });

  it("keeps auth me contract stable", async () => {
    const register = await request(app).post("/api/auth/register").send({
      name: "Contract User",
      email: "contract@example.com",
      password: "password123",
      accountType: "single",
    });
    const accessToken = register.body.data.tokens.accessToken;

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(() =>
      successEnvelopeSchema(authResponseSchema.omit({ tokens: true })).parse(
        response.body,
      ),
    ).not.toThrow();
  });
});
