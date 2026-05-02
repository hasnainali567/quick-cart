import { Router } from "express";

const customerRouter = Router();

customerRouter.use('/profile', (await import('./userRoutes/routes.js')).default)
customerRouter.use('/cart', (await import('./cartRoutes/routes.js')).default)
customerRouter.use('/checkouts', (await import('./checkoutRoutes/routes.js')).default)
customerRouter.use('/orders', (await import('./orderRoutes/routes.js')).default)

export default customerRouter;