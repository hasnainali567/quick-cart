import { Router } from "express";

const publicCategoryRouter = Router();

publicCategoryRouter.get("/", (req, res) => {
  res.send("Category routes");
});

export default publicCategoryRouter;
