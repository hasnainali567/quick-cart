import { Router } from "express";
import { approveProduct, getAllProducts, getProductById, rejectProduct, suspendProduct } from "../../../controllers/adminController/product/admin.product.controller";

const productRouter = Router();

productRouter.get('/', getAllProducts)
productRouter.get('/:id', getProductById)
productRouter.patch('/:id/approve', approveProduct)
productRouter.delete('/:id/reject', rejectProduct)
productRouter.delete('/:id/suspend', suspendProduct)


export default productRouter;