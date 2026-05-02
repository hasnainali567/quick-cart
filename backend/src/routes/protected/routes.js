import { Router } from "express"
import { requireAuth, requireAuthWithactiveOrder } from "../../middlewares/auth.middleware.js"
import customerRoutes from "./customer/routes.js"
import driverRoutes from "./driver/routes.js"
import storeRoutes from "./store/routes.js"

const protectedRouter = Router();


protectedRouter.use('/customer', requireAuthWithactiveOrder, customerRoutes);
protectedRouter.use('/driver', requireAuth, driverRoutes);
protectedRouter.use('/store', requireAuth, storeRoutes);

export default protectedRouter;