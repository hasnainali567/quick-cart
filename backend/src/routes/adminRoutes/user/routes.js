import { Router } from "express";
import { getAllUser, getUserbyId, suspendUser, unsuspendUser } from "../../../controllers/adminController/user/admin.user.controller.js";

const adminUserRouter = Router();

adminUserRouter.get("/", getAllUser);
adminUserRouter.get("/:id", getUserbyId);
adminUserRouter.patch("/:id/suspend", suspendUser);
adminUserRouter.patch("/:id/unsuspend", unsuspendUser);

export default adminUserRouter;
