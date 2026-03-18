import { appResponse } from "../../shared/app-response.js";

import { usersRepo } from "./users.repo.js";
import type { CreateUserInput } from "./users.schema.js";

export const usersService = {
  listUsers() {
    return usersRepo.findAll();
  },

  getUserById(id: number) {
    const user = usersRepo.findById(id);

    if (!user) {
      throw appResponse.withStatus(404, "User not found");
    }

    return user;
  },

  createUser(payload: CreateUserInput) {
    const userWithSameEmail = usersRepo.findByEmail(payload.email);

    if (userWithSameEmail) {
      throw appResponse.withStatus(409, "Email already in use");
    }

    return usersRepo.create(payload);
  },
};
