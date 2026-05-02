import { Router } from "express";
import { upload, uploadSingleImage } from "../../../../middlewares/multer.middleware.js";
import { getMe, getUserNotifications, updateAvatar, updateMe } from "../../../../controllers/customerController/userController/user.controller.js";

const userRouter = Router();

userRouter.get('/', getMe)
userRouter.patch('/', updateMe)
userRouter.get('/notifications', getUserNotifications)
userRouter.patch('/avatar', uploadSingleImage('avatar'), updateAvatar)

userRouter.use('/addresses', (await import('./addressRoutes/routes.js')).default)

export default userRouter;