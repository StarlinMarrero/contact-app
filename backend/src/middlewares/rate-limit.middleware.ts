import { rateLimit } from "express-rate-limit";
import createHttpError from "http-errors";

export const contactFormRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_req, _res, next, options) => {
        next(createHttpError(options.statusCode, "Too many submissions, please try again later"));
    },
});
