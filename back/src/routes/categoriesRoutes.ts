import {Router} from "express";
import {getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory} from "../controllers/categoriesControllers";
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';

const routerCategories: Router = Router();


// GET /categories => Obtener el listado de todas las categorías. (público)
routerCategories.get("/", getAllCategories);
// GET /categories/:id => Obtener el detalle de una categoría específica. (público)
routerCategories.get("/:id", getCategoryById);
// POST /categories => Crear una nueva categoría. (solo admin)
routerCategories.post("/", authMiddleware, isAdmin, createCategory);
// PUT /categories/:id => Actualizar el precio de una categoría. (solo admin)
routerCategories.put("/:id", authMiddleware, isAdmin, updateCategory);
// DELETE /categories/:id => Eliminar una categoría específica. (solo admin)
routerCategories.delete("/:id/delete", authMiddleware, isAdmin, deleteCategory);

export default routerCategories;