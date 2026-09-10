import type { ErrorRequestHandler } from "express";
import { STATUS_CODES } from "http";
import createHttpError, { isHttpError } from "http-errors";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const httpError = isHttpError(err) ? err : createHttpError(500, err);

    if (httpError.status >= 500) console.error(err);

    res.status(httpError.status).json({
        error: {
            code: httpError.status,
            message: httpError.expose ? httpError.message : STATUS_CODES[httpError.status],
            ...(httpError.details && { details: httpError.details }),
        },
    });
};
