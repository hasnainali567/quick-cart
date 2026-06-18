import { Router } from "express";
import {
  registerStore,
  getStore,
  getStoreEarnings,
  getStoreLocation,
  getStoreLogoBanner,
  getStoreReview,
  getStoreTimings,
  toggleStoreStatus,
  updateBanner,
  updateLogo,
  updateStore,
  updateStoreLocation,
  updateStoreTimings,
} from "../../../controllers/storeController/store.controller.js";
import { uploadSingleImage } from "../../../middlewares/multer.middleware.js";
import productRouter from "./product/routes.js";
import { allowRoles } from "../../../middlewares/auth.middleware.js";
import orderRouter from "./order/routes.js";
import storeCategoryRouter from "./category/routes.js";
const storeAdminRouter = Router();

storeAdminRouter.post("/register", registerStore);

storeAdminRouter.use(allowRoles("STORE_ADMIN", "SUPER_ADMIN"));
storeAdminRouter.get("/", getStore);
storeAdminRouter.get("/review", getStoreReview);
//Product Routes
storeAdminRouter.use("/products", productRouter);
storeAdminRouter.use("/category", storeCategoryRouter);

//Order Routes
storeAdminRouter.use("/orders", orderRouter);
storeAdminRouter.patch("/:id/update", updateStore);
storeAdminRouter.get("/:id/logo-banner", getStoreLogoBanner);
storeAdminRouter.patch("/:id/logo", uploadSingleImage("logo"), updateLogo);
storeAdminRouter.patch(
  "/:id/banner",
  uploadSingleImage("banner"),
  updateBanner,
);
storeAdminRouter.patch("/:id/status", toggleStoreStatus);

//Earnings Route
storeAdminRouter.get("/:id/earnings", getStoreEarnings);

//Timing Routes
storeAdminRouter.get("/:id/timings", getStoreTimings);
storeAdminRouter.patch("/:id/timings", updateStoreTimings);

//Location Routes
storeAdminRouter.get("/:id/location", getStoreLocation);
storeAdminRouter.patch("/:id/location", updateStoreLocation);

export default storeAdminRouter;
