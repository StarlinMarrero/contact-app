import { Router } from "express";
import contactFormRoutes from "./contact-form";

const router: Router = Router();

router.use("/contact-forms", contactFormRoutes);

export default router;
