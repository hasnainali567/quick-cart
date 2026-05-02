import { Router } from "express";
import { getAllStores, getStorebyId, verifyStore, approveStore, rejectStore, suspendStore, updateStoreCommission } from "../../../controllers/adminController/store/admin.store.controller";

const adminStoreRouter = Router();

adminStoreRouter.get('/', getAllStores);
adminStoreRouter.get('/:id', getStorebyId);
adminStoreRouter.patch('/:id/verify', verifyStore);
adminStoreRouter.patch('/:id/approve', approveStore);
adminStoreRouter.patch('/:id/reject', rejectStore);
adminStoreRouter.patch('/:id/suspend', suspendStore);
adminStoreRouter.patch('/:id/commission', updateStoreCommission);

export default adminStoreRouter;