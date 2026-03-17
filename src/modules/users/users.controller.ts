import type { Request, Response } from "express";

import { createUserSchema, userIdSchema } from "./users.schema.js";
import { usersService } from "./users.service.js";

export const usersController = {
  list(req: Request, res: Response): void {
    const users = usersService.listUsers();
    res.status(200).json({ success: true, data: users });
  },

  getById(req: Request, res: Response): void {
    const { id } = userIdSchema.parse(req.params);
    const user = usersService.getUserById(id);
    res.status(200).json({ success: true, data: user });
  },

  create(req: Request, res: Response): void {
    const payload = createUserSchema.parse(req.body);
    const user = usersService.createUser(payload);
    res.status(201).json({ success: true, data: user });
  }
};
