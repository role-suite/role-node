import { beforeEach, describe, expect, it } from "vitest";

import { usersRepo } from "../../src/modules/users/users.repo.js";

describe("users repo", () => {
  beforeEach(() => {
    usersRepo.clear();
  });

  it("creates users with incrementing ids", () => {
    const first = usersRepo.create({ name: "First", email: "first@example.com" });
    const second = usersRepo.create({ name: "Second", email: "second@example.com" });

    expect(first.id).toBe(1);
    expect(second.id).toBe(2);
  });

  it("finds users by id and email", () => {
    const created = usersRepo.create({ name: "Find", email: "find@example.com" });

    expect(usersRepo.findById(created.id)).toEqual(created);
    expect(usersRepo.findByEmail(created.email)).toEqual(created);
  });

  it("clears state", () => {
    usersRepo.create({ name: "Temp", email: "temp@example.com" });
    usersRepo.clear();

    expect(usersRepo.findAll()).toEqual([]);
    const next = usersRepo.create({ name: "After", email: "after@example.com" });
    expect(next.id).toBe(1);
  });
});
