import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import createService from "../../services/contact-form/create.service";
import { CreateContactFormDTO, createContactFormSchema } from "./dto/create.dto";

class ContactFormController {
    private static _instance: ContactFormController;

    public static get instance(): ContactFormController {
        if (!ContactFormController._instance) {
            ContactFormController._instance = new ContactFormController();
        }

        return ContactFormController._instance;
    }

    public async create(req: Request<object, object, CreateContactFormDTO>, res: Response, next: NextFunction) {
        const validate = createContactFormSchema.safeParse(req.body);
        if (!validate.success) {
            const { formErrors, fieldErrors } = z.flattenError(validate.error);
            return next(createHttpError(400, formErrors[0] ?? "Error validation", { details: fieldErrors }));
        }

        const { data, error } = await createService({ payload: validate.data });
        if (error || !data) return next(error ?? createHttpError(500));

        return res.status(201).json(data);
    }
}

export default ContactFormController;
