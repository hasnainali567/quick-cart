import { Router } from "express";
import { approveDriver, getAllDrivers, getDriverById, rejectDriver, suspendDriver } from "../../../controllers/adminController/driver/admin.driver.controller";

const driverRouter = Router();

driverRouter.get('/', getAllDrivers)
driverRouter.get('/:id', getDriverById)
driverRouter.patch('/:id/approve', approveDriver)
driverRouter.patch('/:id/reject', rejectDriver)
driverRouter.patch('/:id/suspend', suspendDriver)

export default driverRouter;