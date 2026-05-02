import { Router } from "express";
import { addProductVariant, createProduct, deleteProduct, deleteProductVariant, getAllProducts, getProduct, getProductVariant, toggleProductStatus, updateProduct, updateProductVariant } from "../../../../controllers/storeController/product/product.controller.js";
import { upload } from "../../../../middlewares/multer.middleware.js";

const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.post('/', upload.fields([{ name: 'images', maxCount: 5 }]), createProduct);
productRouter.get('/:slug', getProduct);
productRouter.patch('/:productId', updateProduct);
productRouter.delete('/:productId', deleteProduct);
productRouter.patch('/:productId/status', toggleProductStatus);
productRouter.get('/:productId/variant/:variantId', getProductVariant);
productRouter.post('/:productId/variant', addProductVariant);
productRouter.patch('/:productId/variant/:variantId', updateProductVariant);
productRouter.delete('/:productId/variant/:variantId', deleteProductVariant);

export default productRouter;