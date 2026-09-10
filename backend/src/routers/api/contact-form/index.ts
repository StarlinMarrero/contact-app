import { Router } from "express";
import ContactFormController from "../../../controllers/contact-form/contact-form.controller";
import { contactFormRateLimit } from "../../../middlewares/rate-limit.middleware";

const controller = ContactFormController.instance;

const router: Router = Router();

router.post("/", contactFormRateLimit, controller.create);

export default router;
