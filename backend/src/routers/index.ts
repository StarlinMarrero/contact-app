import { Router } from "express";
import apiRoutes from "./api";
import publicRouter from "./public";

const router: Router = Router();

router.use("/", publicRouter);
router.use("/api", apiRoutes);

export default router;
