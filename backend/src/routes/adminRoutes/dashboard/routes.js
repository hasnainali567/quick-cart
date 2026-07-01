import { Router } from "express";
import { getDashboardStats } from "../../../controllers/adminController/dashboard/admin.dashboard.controller.js";

const router = Router();

router.get("/", getDashboardStats);

export default router;
