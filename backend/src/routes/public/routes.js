import { Router } from "express";
import publicProductsRouter from "./products/routes";
import publicCategoryRouter from "./category/routes";

const publicRouter = Router();

// Health check endpoint
publicRouter.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

publicRouter.use("/products", publicProductsRouter);
publicRouter.use("/category", publicCategoryRouter);

export default publicRouter;
