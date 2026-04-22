import { Router } from "express";

import { ROUTE_SEGMENTS } from "../../shared/http/routes.js";
import { environmentsController } from "./environments.controller.js";

export const environmentsRouter = Router({ mergeParams: true });

environmentsRouter.get(
  ROUTE_SEGMENTS.environments.list,
  environmentsController.list,
);
environmentsRouter.get(
  ROUTE_SEGMENTS.environments.byId,
  environmentsController.getById,
);
environmentsRouter.post(
  ROUTE_SEGMENTS.environments.create,
  environmentsController.create,
);
environmentsRouter.patch(
  ROUTE_SEGMENTS.environments.byId,
  environmentsController.update,
);
environmentsRouter.delete(
  ROUTE_SEGMENTS.environments.byId,
  environmentsController.remove,
);
environmentsRouter.get(
  ROUTE_SEGMENTS.environments.variables,
  environmentsController.listVariables,
);
environmentsRouter.get(
  ROUTE_SEGMENTS.environments.variableById,
  environmentsController.getVariableById,
);
environmentsRouter.post(
  ROUTE_SEGMENTS.environments.variables,
  environmentsController.createVariable,
);
environmentsRouter.patch(
  ROUTE_SEGMENTS.environments.variableById,
  environmentsController.updateVariable,
);
environmentsRouter.delete(
  ROUTE_SEGMENTS.environments.variableById,
  environmentsController.removeVariable,
);
