"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriesControllers_1 = require("../controllers/categoriesControllers");
const routerCategories = (0, express_1.Router)();
// GET /categories => Obtener el listado de todas las categorías.
routerCategories.get("/", categoriesControllers_1.getAllCategories);
// GET /categories/:id => Obtener el detalle de una categoría específica.
routerCategories.get("/:id", categoriesControllers_1.getCategoryById);
// POST /categories => Crear una nueva categoría.
routerCategories.post("/", categoriesControllers_1.createCategory);
// DELETE /categories/:id => Eliminar una categoría específica.
routerCategories.delete("/:id/delete", categoriesControllers_1.deleteCategory);
exports.default = routerCategories;
