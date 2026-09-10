import cors from "cors";
import express from "express";
import helmet from "helmet";
import createHttpError from "http-errors";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error-handler.middleware";
import appRoutes from "./routers";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((o) => o.trim()) }));
app.use(express.json({ limit: "100kb" }));

app.use(appRoutes);

app.use((_req, _res, next) => {
    next(createHttpError(404, "Resource not found"));
});

app.use(errorHandler);
