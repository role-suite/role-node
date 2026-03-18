import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app } from "../../src/app.js";
import { usersRepo } from "../../src/modules/users/users.repo.js";

describe("users e2e flow", () => {
  beforeEach(() => {
    usersRepo.clear();
  });

  it("runs end-to-end create, list and fetch flow", async () => {
    const usersToCreate = [
      { name: "E2E One", email: "e2e1@example.com" },
      { name: "E2E Two", email: "e2e2@example.com" },
      { name: "E2E Three", email: "e2e3@example.com" },
    ];

    for (const payload of usersToCreate) {
      const createResponse = await request(app)
        .post("/api/users")
        .send(payload);
      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);
    }

    const listResponse = await request(app).get("/api/users");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(3);

    const targetId = listResponse.body.data[2].id;
    const getResponse = await request(app).get(`/api/users/${targetId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data).toEqual(
      expect.objectContaining({
        name: "E2E Three",
        email: "e2e3@example.com",
      }),
    );
  });
});
