import { beforeEach, describe, expect, it } from "vitest";

import { appResponse } from "../../src/shared/app-response.js";
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
    const user = usersService.createUser({
      name: "Lookup",
      email: "lookup@example.com",
    });
    const found = usersService.getUserById(user.id);

    expect(found.email).toBe("lookup@example.com");
  });

  it("throws centralized app-response error payload for missing user", () => {
    expect.assertions(1);

    try {
      usersService.getUserById(999);
    } catch (error) {
      expect(error).toMatchObject(
        appResponse.withStatus(404, "User not found"),
      );
    }
  });

  it("throws centralized app-response error payload for duplicate email", () => {
    usersService.createUser({ name: "One", email: "dup@example.com" });
    expect.assertions(1);

    try {
      usersService.createUser({ name: "Two", email: "dup@example.com" });
    } catch (error) {
      expect(error).toMatchObject(
        appResponse.withStatus(409, "Email already in use"),
      );
    }
  });
});
