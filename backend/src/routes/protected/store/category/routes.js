import { Router } from "express";
import {
  addCategorytoStore,
  getCategories,
} from "../../../../controllers/storeController/category/category.contorller";

const storeCategoryRouter = Router();

storeCategoryRouter.get("/", getCategories);
storeCategoryRouter.post("/:categoryId", addCategorytoStore);

export default storeCategoryRouter;
