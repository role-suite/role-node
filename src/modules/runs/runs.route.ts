import { Router } from "express";

import { runsController } from "./runs.controller.js";

export const runsRouter = Router({ mergeParams: true });

runsRouter.post("/", runsController.create);
runsRouter.get("/:runId", runsController.getById);
runsRouter.post("/:runId/cancel", runsController.cancel);
