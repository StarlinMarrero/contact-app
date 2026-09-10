import type { HttpError } from "http-errors";

export interface IResServices<T> {
    error?: HttpError;
    data?: T;
}
