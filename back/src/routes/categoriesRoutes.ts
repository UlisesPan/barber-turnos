import { Router } from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/categoriesControllers";
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';
import { validate, parseIdParam } from '../middlewares/validate';
import { createCategorySchema, updateCategorySchema } from '../schemas';

const routerCategories: Router = Router();

routerCategories.get("/", getAllCategories);
routerCategories.get("/:id", parseIdParam(), getCategoryById);
routerCategories.post("/", authMiddleware, isAdmin, validate(createCategorySchema), createCategory);
routerCategories.put("/:id", authMiddleware, isAdmin, parseIdParam(), validate(updateCategorySchema), updateCategory);
routerCategories.delete("/:id", authMiddleware, isAdmin, parseIdParam(), deleteCategory);

export default routerCategories;
