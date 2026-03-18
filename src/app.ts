import express from "express";

import { usersRouter } from "./modules/users/users.route.js";
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

app.use("/api/users", usersRouter);

app.use(notFoundHandler);
app.use(errorHandler);
