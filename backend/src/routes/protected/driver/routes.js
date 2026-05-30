import { Router } from "express";
import { getDriver, getNearbyDrivers, registerDriver, getDriverDeliveries, getDriverProfile, toggleDriverStatus, updateDriverLocation } from "../../../controllers/driverController/driver.controller.js";
import { requestToPickup } from "../../../controllers/driverController/order/order.controller.js";

const driverRouter = Router()

driverRouter.post('/register', registerDriver)
driverRouter.get('/', getDriver);
driverRouter.get('/nearby', getNearbyDrivers)
driverRouter.patch('/status', toggleDriverStatus)
driverRouter.put('/location', updateDriverLocation)
driverRouter.get('/deliveries', getDriverDeliveries)
driverRouter.get('/profile', getDriverProfile)
driverRouter.post('/:driverId/request/:orderId', requestToPickup)



export default driverRouter;