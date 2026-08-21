import { Router } from "express";

import { ROUTE_SEGMENTS } from "../../shared/routes.js";
import { importExportController } from "./controller.js";

export const importExportRouter = Router({ mergeParams: true });

importExportRouter.get(
  ROUTE_SEGMENTS.importExport.jobs,
  importExportController.listJobs,
);
importExportRouter.get(
  ROUTE_SEGMENTS.importExport.jobById,
  importExportController.getJobById,
);
importExportRouter.post(
  ROUTE_SEGMENTS.importExport.exports,
  importExportController.createExport,
);
importExportRouter.post(
  ROUTE_SEGMENTS.importExport.imports,
  importExportController.createImport,
);
