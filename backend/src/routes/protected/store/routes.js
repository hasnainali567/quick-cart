import { Router } from "express";
import { createStore, getStore, getStoreEarnings, getStoreLocation, getStoreLogoBanner, getStoreReview, getStoreTimings, toggleStoreStatus, updateBanner, updateLogo, updateStore, updateStoreLocation, updateStoreTimings,  } from "../../../controllers/storeController/store.controller.js";
import { uploadSingleImage } from "../../../middlewares/multer.middleware.js";
import productRouter from "./product/routes.js";
import { allowRoles } from '../../../middlewares/auth.middleware.js';
const storeAdminRouter = Router();

storeAdminRouter.post('/create', createStore);

storeAdminRouter.use(allowRoles('STORE_ADMIN', 'SUPER_ADMIN'))
storeAdminRouter.get('/', getStore);
storeAdminRouter.get('/review', getStoreReview);
storeAdminRouter.patch('/:id/update', updateStore);
storeAdminRouter.get('/:id/logo-banner', getStoreLogoBanner);
storeAdminRouter.patch('/:id/logo', uploadSingleImage('logo'), updateLogo);
storeAdminRouter.patch('/:id/banner', uploadSingleImage('banner'), updateBanner);
storeAdminRouter.patch('/:id/status', toggleStoreStatus);
storeAdminRouter.get('/:id/earnings', getStoreEarnings);
storeAdminRouter.get('/:id/timings', getStoreTimings);
storeAdminRouter.patch('/:id/timings', updateStoreTimings);
storeAdminRouter.get('/:id/location', getStoreLocation);
storeAdminRouter.patch('/:id/location', updateStoreLocation);
storeAdminRouter.use('/product', productRouter)

export default storeAdminRouter;