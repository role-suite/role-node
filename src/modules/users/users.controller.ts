import type { Request, Response } from "express";

import { appResponse } from "../../shared/app-response.js";
import { createUserSchema, userIdSchema } from "./users.schema.js";
import { usersService } from "./users.service.js";

export const usersController = {
  list(req: Request, res: Response): void {
    const users = usersService.listUsers();
    appResponse.sendSuccess(res, 200, users);
  },

  getById(req: Request, res: Response): void {
    const { id } = userIdSchema.parse(req.params);
    const user = usersService.getUserById(id);
    appResponse.sendSuccess(res, 200, user);
  },

  create(req: Request, res: Response): void {
    const payload = createUserSchema.parse(req.body);
    const user = usersService.createUser(payload);
    appResponse.sendSuccess(res, 201, user);
  },
};
