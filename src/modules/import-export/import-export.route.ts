import { Router } from "express";

import { importExportController } from "./import-export.controller.js";

export const importExportRouter = Router({ mergeParams: true });

importExportRouter.get("/jobs", importExportController.listJobs);
importExportRouter.get("/jobs/:jobId", importExportController.getJobById);
importExportRouter.post("/exports", importExportController.createExport);
importExportRouter.post("/imports", importExportController.createImport);
