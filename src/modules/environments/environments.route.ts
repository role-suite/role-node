import { Router } from "express";

import { environmentsController } from "./environments.controller.js";

export const environmentsRouter = Router({ mergeParams: true });

environmentsRouter.get("/", environmentsController.list);
environmentsRouter.get("/:environmentId", environmentsController.getById);
environmentsRouter.post("/", environmentsController.create);
environmentsRouter.patch("/:environmentId", environmentsController.update);
environmentsRouter.delete("/:environmentId", environmentsController.remove);
environmentsRouter.get(
  "/:environmentId/variables",
  environmentsController.listVariables,
);
environmentsRouter.get(
  "/:environmentId/variables/:variableId",
  environmentsController.getVariableById,
);
environmentsRouter.post(
  "/:environmentId/variables",
  environmentsController.createVariable,
);
environmentsRouter.patch(
  "/:environmentId/variables/:variableId",
  environmentsController.updateVariable,
);
environmentsRouter.delete(
  "/:environmentId/variables/:variableId",
  environmentsController.removeVariable,
);
