import { Router } from "express";
import { allowRoles, requireAuth } from "../../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter.use(requireAuth)
adminRouter.use(allowRoles(['SUPER_ADMIN']));

adminRouter.use('/user', (await import('./user/routes.js')).default)
adminRouter.use('/store', (await import('./store/routes.js')).default)
adminRouter.use('/product', (await import('./product/routes.js')).default)
adminRouter.use('/category', (await import('./category/routes.js')).default)
adminRouter.use('/driver', (await import('./driver/routes.js')).default)



export default adminRouter;