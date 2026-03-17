import { AppError } from "../../shared/errors/app-error.js";

import { usersRepo } from "./users.repo.js";
import type { CreateUserInput } from "./users.schema.js";

export const usersService = {
  listUsers() {
    return usersRepo.findAll();
  },

  getUserById(id: number) {
    const user = usersRepo.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  },

  createUser(payload: CreateUserInput) {
    const userWithSameEmail = usersRepo.findByEmail(payload.email);

    if (userWithSameEmail) {
      throw new AppError("Email already in use", 409);
    }

    return usersRepo.create(payload);
  }
};
