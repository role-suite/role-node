import express from "express";

import { usersRouter } from "./modules/users/users.route.js";
import { errorHandler } from "./shared/errors/error-handler.js";
import { notFoundHandler } from "./shared/middleware/not-found.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

app.use("/api/users", usersRouter);

app.use(notFoundHandler);
app.use(errorHandler);
