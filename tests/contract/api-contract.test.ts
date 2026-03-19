import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";

import { app } from "../../src/app.js";
import {
  authRepo,
  setAuthRepoDbClient,
} from "../../src/modules/auth/auth.repo.js";
import { setCollectionsRepoDbClient } from "../../src/modules/collections/collections.repo.js";
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

const collectionSchema = z.object({
  id: z.number().int().positive(),
  workspaceId: z.number().int().positive(),
  name: z.string().min(2),
  description: z.string().nullable(),
  createdByUserId: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const endpointSchema = z.object({
  id: z.number().int().positive(),
  collectionId: z.number().int().positive(),
  name: z.string().min(2),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]),
  url: z.string().min(1),
  headers: z.array(
    z.object({
      key: z.string().min(1),
      value: z.string(),
      enabled: z.boolean().optional(),
    }),
  ),
  queryParams: z.array(
    z.object({
      key: z.string().min(1),
      value: z.string(),
      enabled: z.boolean().optional(),
    }),
  ),
  body: z
    .object({
      contentType: z.string().optional(),
      raw: z.string().optional(),
    })
    .nullable(),
  auth: z
    .union([
      z.object({ type: z.literal("none") }),
      z.object({ type: z.literal("bearer"), token: z.string().min(1) }),
      z.object({
        type: z.literal("basic"),
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    ])
    .nullable(),
  position: z.number().int().min(0),
  createdByUserId: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const successEnvelopeSchema = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.object({
    success: z.literal(true),
    data: schema,
  });

describe("API contract", () => {
  beforeEach(async () => {
    setAuthRepoDbClient(testDb);
    setCollectionsRepoDbClient(testDb);
    await authRepo.clear();
  });

  afterAll(() => {
    setAuthRepoDbClient(null);
    setCollectionsRepoDbClient(null);
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

  it("keeps workspace collections contract stable", async () => {
    const register = await request(app).post("/api/auth/register").send({
      name: "Contract User",
      email: "contract@example.com",
      password: "password123",
      accountType: "single",
    });
    const accessToken = register.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Contract Team" });
    const workspaceId = workspace.body.data.id;

    const createCollection = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Orders", description: "Orders endpoints" });

    expect(createCollection.status).toBe(201);
    expect(() =>
      successEnvelopeSchema(collectionSchema).parse(createCollection.body),
    ).not.toThrow();

    const listCollections = await request(app)
      .get(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(listCollections.status).toBe(200);
    expect(() =>
      successEnvelopeSchema(z.array(collectionSchema)).parse(
        listCollections.body,
      ),
    ).not.toThrow();
  });

  it("keeps collection endpoint contract stable", async () => {
    const register = await request(app).post("/api/auth/register").send({
      name: "Contract User",
      email: "contract@example.com",
      password: "password123",
      accountType: "single",
    });
    const accessToken = register.body.data.tokens.accessToken;

    const workspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Contract Team" });
    const workspaceId = workspace.body.data.id;

    const collection = await request(app)
      .post(`/api/workspaces/${workspaceId}/collections`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Orders" });
    const collectionId = collection.body.data.id;

    const createEndpoint = await request(app)
      .post(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/endpoints`,
      )
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Get Orders",
        method: "GET",
        url: "https://api.example.com/orders",
      });

    expect(createEndpoint.status).toBe(201);
    expect(() =>
      successEnvelopeSchema(endpointSchema).parse(createEndpoint.body),
    ).not.toThrow();
  });
});
