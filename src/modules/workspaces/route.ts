import { Router } from "express";

import { ROUTE_SEGMENTS } from "../../shared/http/routes.js";
import { requireAuth } from "../../shared/middleware/require-auth.js";
import { collectionsRouter } from "../collections/collections.route.js";
import { environmentsRouter } from "../environments/environments.route.js";
import { importExportRouter } from "../import-export/import-export.route.js";
import { runsRouter } from "../runs/runs.route.js";
import { workspacesController } from "./workspaces.controller.js";

export const workspacesRouter = Router();

workspacesRouter.use(requireAuth);

workspacesRouter.get(ROUTE_SEGMENTS.workspaces.list, workspacesController.list);
workspacesRouter.get(
  ROUTE_SEGMENTS.workspaces.byId,
  workspacesController.getById,
);
workspacesRouter.post(
  ROUTE_SEGMENTS.workspaces.create,
  workspacesController.create,
);
workspacesRouter.get(
  ROUTE_SEGMENTS.workspaces.members,
  workspacesController.listMembers,
);
workspacesRouter.post(
  ROUTE_SEGMENTS.workspaces.members,
  workspacesController.addMember,
);
workspacesRouter.post(
  ROUTE_SEGMENTS.workspaces.invitations,
  workspacesController.createInvitation,
);
workspacesRouter.patch(
  ROUTE_SEGMENTS.workspaces.memberByUserId,
  workspacesController.updateMemberRole,
);
workspacesRouter.delete(
  ROUTE_SEGMENTS.workspaces.memberByUserId,
  workspacesController.removeMember,
);
workspacesRouter.post(
  ROUTE_SEGMENTS.workspaces.join,
  workspacesController.join,
);
workspacesRouter.post(
  ROUTE_SEGMENTS.workspaces.leave,
  workspacesController.leave,
);
workspacesRouter.post(
  ROUTE_SEGMENTS.workspaces.convertToTeam,
  workspacesController.convertToTeam,
);
workspacesRouter.get(
  ROUTE_SEGMENTS.workspaces.updates,
  workspacesController.listUpdates,
);
workspacesRouter.use(
  ROUTE_SEGMENTS.workspaces.nested.environments,
  environmentsRouter,
);
workspacesRouter.use(
  ROUTE_SEGMENTS.workspaces.nested.collections,
  collectionsRouter,
);
workspacesRouter.use(
  ROUTE_SEGMENTS.workspaces.nested.importExport,
  importExportRouter,
);
workspacesRouter.use(ROUTE_SEGMENTS.workspaces.nested.runs, runsRouter);
