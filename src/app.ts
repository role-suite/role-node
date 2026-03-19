import express from "express";

import { authRouter } from "./modules/auth/auth.route.js";
import { workspacesRouter } from "./modules/workspaces/workspaces.route.js";
import { appResponse } from "./shared/app-response.js";
import { errorHandler } from "./shared/errors/error-handler.js";
import { notFoundHandler } from "./shared/middleware/not-found.js";
import { requestLogger } from "./shared/middleware/request-logger.js";

export const app = express();

app.use(requestLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  appResponse.sendSuccess(res, 200, { status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspacesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
