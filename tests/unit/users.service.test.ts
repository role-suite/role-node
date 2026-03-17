import { beforeEach, describe, expect, it } from "vitest";

import { AppError } from "../../src/shared/errors/app-error.js";
import { usersRepo } from "../../src/modules/users/users.repo.js";
import { usersService } from "../../src/modules/users/users.service.js";

describe("users service", () => {
  beforeEach(() => {
    usersRepo.clear();
  });

  it("lists users", () => {
    usersService.createUser({ name: "List One", email: "list1@example.com" });
    usersService.createUser({ name: "List Two", email: "list2@example.com" });

    const users = usersService.listUsers();
    expect(users).toHaveLength(2);
  });

  it("gets a user by id", () => {
    const user = usersService.createUser({ name: "Lookup", email: "lookup@example.com" });
    const found = usersService.getUserById(user.id);

    expect(found.email).toBe("lookup@example.com");
  });

  it("throws AppError for missing user", () => {
    expect(() => usersService.getUserById(999)).toThrowError(AppError);
    expect(() => usersService.getUserById(999)).toThrowError("User not found");
  });

  it("throws AppError for duplicate email", () => {
    usersService.createUser({ name: "One", email: "dup@example.com" });

    expect(() =>
      usersService.createUser({ name: "Two", email: "dup@example.com" })
    ).toThrowError(AppError);
  });
});
