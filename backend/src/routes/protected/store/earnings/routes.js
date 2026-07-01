import { Router } from "express";
import { getStoreEarnings } from "../../../../controllers/storeController/earnings/earnings.controller.js";

const earningsRouter = Router();

earningsRouter.get('/', getStoreEarnings);

export default earningsRouter;
