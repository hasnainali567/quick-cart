import { Router } from "express";
import {
  addCategorytoStore,
  getCategories,
  deleteCategoryFromStore,
} from "../../../../controllers/storeController/category/category.controller.js";

const storeCategoryRouter = Router();

storeCategoryRouter.get("/", getCategories);
storeCategoryRouter.post("/:categoryId", addCategorytoStore);
storeCategoryRouter.delete("/:categoryId", deleteCategoryFromStore);

export default storeCategoryRouter;
