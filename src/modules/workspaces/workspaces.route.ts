import { Router } from "express";

import { requireAuth } from "../../shared/middleware/require-auth.js";
import { collectionsRouter } from "../collections/collections.route.js";
import { workspacesController } from "./workspaces.controller.js";

export const workspacesRouter = Router();

workspacesRouter.use(requireAuth);

workspacesRouter.get("/", workspacesController.list);
workspacesRouter.get("/:workspaceId", workspacesController.getById);
workspacesRouter.post("/", workspacesController.create);
workspacesRouter.get("/:workspaceId/members", workspacesController.listMembers);
workspacesRouter.post("/:workspaceId/members", workspacesController.addMember);
workspacesRouter.patch(
  "/:workspaceId/members/:memberUserId",
  workspacesController.updateMemberRole,
);
workspacesRouter.delete(
  "/:workspaceId/members/:memberUserId",
  workspacesController.removeMember,
);
workspacesRouter.post("/:workspaceId/leave", workspacesController.leave);
workspacesRouter.use("/:workspaceId/collections", collectionsRouter);
