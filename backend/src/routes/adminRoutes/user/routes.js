import { Router } from "express";
import { getAllUser, getUserbyId } from "../../../controllers/adminController/user/admin.user.controller";

const adminUserRouter = Router()

adminUserRouter.get('/', getAllUser)
adminUserRouter.get('/:id', getUserbyId)


export default adminUserRouter;