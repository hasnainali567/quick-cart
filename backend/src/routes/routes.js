import { Router } from "express";
import { allowRoles, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.use('/auth', (await import('./authRoutes/auth.routes.js')).default)
router.use('/public', (await import('./public/routes.js')).default)
router.use('/', (await import('./protected/routes.js')).default)
router.use('/admin', (await import('./adminRoutes/routes.js')).default)


export default router;