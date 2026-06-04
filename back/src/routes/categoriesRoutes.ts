import {Router} from "express";
import {getAllCategories, getCategoryById, createCategory, deleteCategory} from "../controllers/categoriesControllers";

const routerCategories: Router = Router();


// GET /categories => Obtener el listado de todas las categorías.
routerCategories.get("/", getAllCategories);
// GET /categories/:id => Obtener el detalle de una categoría específica.
routerCategories.get("/:id", getCategoryById);
// POST /categories => Crear una nueva categoría.
routerCategories.post("/", createCategory);
// DELETE /categories/:id => Eliminar una categoría específica.
routerCategories.delete("/:id/delete", deleteCategory);

export default routerCategories;