import { Router } from "express";
import { getAllCategories } from "../../../controllers/protected/category/category.controller";

const categoryRouter = Router();

// only get route will be here

categoryRouter.get("/all", getAllCategories);

export default categoryRouter;
