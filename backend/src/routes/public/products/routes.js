import { Router } from "express";
import { getPublicProducts } from "../../../controllers/publicController/products/product.controller";

const publicProductsRouter = Router();

publicProductsRouter.get("/", getPublicProducts);

export default publicProductsRouter;