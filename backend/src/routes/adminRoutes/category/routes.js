import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategorybyId, updateCategory, getCategoryProducts } from "../../../controllers/adminController/category/admin.category.controller";

const categoryRouter = Router();

categoryRouter.get('/', getAllCategories)
categoryRouter.get('/:id', getCategorybyId)
categoryRouter.post('/', createCategory)
categoryRouter.patch('/:id', updateCategory)
categoryRouter.delete('/:id', deleteCategory)
categoryRouter.get('/:id/products', getCategoryProducts)

export default categoryRouter;