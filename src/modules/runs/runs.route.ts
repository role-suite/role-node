import { Router } from "express";

import { ROUTE_SEGMENTS } from "../../shared/http/routes.js";
import { runsController } from "./runs.controller.js";

export const runsRouter = Router({ mergeParams: true });

runsRouter.post(ROUTE_SEGMENTS.runs.create, runsController.create);
runsRouter.get(ROUTE_SEGMENTS.runs.byId, runsController.getById);
runsRouter.post(ROUTE_SEGMENTS.runs.cancel, runsController.cancel);
