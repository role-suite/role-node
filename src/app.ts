import express from "express";

import { env } from "./config/env.js";
import { docsRouter } from "./docs/swagger.js";
import { authRouter } from "./modules/auth/route.js";
import { workspacesRouter } from "./modules/workspaces/route.js";
import { appResponse } from "./shared/app-response.js";
import { errorHandler } from "./shared/errors/error-handler.js";
import { API_MOUNTS, ROUTE_SEGMENTS } from "./shared/routes.js";
import { notFoundHandler } from "./shared/middleware/not-found.js";
import { requestIdMiddleware } from "./shared/middleware/request-id.js";
import { requestLogger } from "./shared/middleware/request-logger.js";

export const app = express();

app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }));

app.get(ROUTE_SEGMENTS.health, (_req, res) => {
  appResponse.sendObject(res, 200, { status: "ok" });
});

if (env.NODE_ENV !== "production") {
  app.use("/docs", docsRouter);
}

app.use(API_MOUNTS.auth, authRouter);
app.use(API_MOUNTS.workspaces, workspacesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
