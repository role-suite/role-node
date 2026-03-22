import { Router } from "express";

import { collectionsController } from "./collections.controller.js";

export const collectionsRouter = Router({ mergeParams: true });

collectionsRouter.get("/", collectionsController.list);
collectionsRouter.get("/:collectionId", collectionsController.getById);
collectionsRouter.post("/", collectionsController.create);
collectionsRouter.patch("/:collectionId", collectionsController.update);
collectionsRouter.delete("/:collectionId", collectionsController.remove);
collectionsRouter.get(
  "/:collectionId/endpoints",
  collectionsController.listEndpoints,
);
collectionsRouter.get(
  "/:collectionId/endpoints/:endpointId",
  collectionsController.getEndpointById,
);
collectionsRouter.post(
  "/:collectionId/endpoints",
  collectionsController.createEndpoint,
);
collectionsRouter.patch(
  "/:collectionId/endpoints/:endpointId",
  collectionsController.updateEndpoint,
);
collectionsRouter.delete(
  "/:collectionId/endpoints/:endpointId",
  collectionsController.removeEndpoint,
);
collectionsRouter.get(
  "/:collectionId/endpoints/:endpointId/examples",
  collectionsController.listEndpointExamples,
);
collectionsRouter.post(
  "/:collectionId/endpoints/:endpointId/examples",
  collectionsController.createEndpointExample,
);
collectionsRouter.patch(
  "/:collectionId/endpoints/:endpointId/examples/:exampleId",
  collectionsController.updateEndpointExample,
);
collectionsRouter.delete(
  "/:collectionId/endpoints/:endpointId/examples/:exampleId",
  collectionsController.removeEndpointExample,
);
collectionsRouter.get(
  "/:collectionId/folders",
  collectionsController.listFolders,
);
collectionsRouter.post(
  "/:collectionId/folders",
  collectionsController.createFolder,
);
collectionsRouter.patch(
  "/:collectionId/folders/:folderId",
  collectionsController.updateFolder,
);
collectionsRouter.delete(
  "/:collectionId/folders/:folderId",
  collectionsController.removeFolder,
);
