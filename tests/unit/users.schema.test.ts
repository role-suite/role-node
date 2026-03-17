import { describe, expect, it } from "vitest";

import { createUserSchema, userIdSchema } from "../../src/modules/users/users.schema.js";

describe("users schema", () => {
  it("parses valid create payload", () => {
    const payload = createUserSchema.parse({
      name: "Altay",
      email: "altay@example.com"
    });

    expect(payload).toEqual({
      name: "Altay",
      email: "altay@example.com"
    });
  });

  it("rejects invalid create payload", () => {
    const result = createUserSchema.safeParse({
      name: "A",
      email: "invalid"
    });

    expect(result.success).toBe(false);
  });

  it("coerces route param id to number", () => {
    const parsed = userIdSchema.parse({ id: "12" });
    expect(parsed.id).toBe(12);
  });
});
