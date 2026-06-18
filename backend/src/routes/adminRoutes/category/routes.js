import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategorybyId,
  updateCategory,
  getCategoryProducts,
  toggleCategoryStatus,
} from "../../../controllers/adminController/category/admin.category.controller";
import { uploadSingleImage } from "../../../middlewares/multer.middleware.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategorybyId);
categoryRouter.post("/", uploadSingleImage("image"), createCategory);
categoryRouter.patch("/:id", uploadSingleImage("image"), updateCategory);
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.get("/:id/products", getCategoryProducts);
categoryRouter.patch("/:id/status", toggleCategoryStatus);

export default categoryRouter;
