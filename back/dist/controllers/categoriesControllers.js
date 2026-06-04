"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const categoriesService_1 = require("../services/categoriesService");
// GET /categories => Obtener el listado de todas las categorías.
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, categoriesService_1.getAllCategoriesService)();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener las categorías" });
    }
});
exports.getAllCategories = getAllCategories;
// GET /categories/:id => Obtener el detalle de una categoría específica.
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const categoryData = yield (0, categoriesService_1.getCategoryByIdService)(id);
        res.status(200).json(categoryData);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al obtener la categoría"
        });
    }
});
exports.getCategoryById = getCategoryById;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = req.body;
        if (!categoryData.name || !categoryData.duration || !categoryData.price) {
            res.status(400).json({
                message: "Faltan campos requeridos: name, duration, price",
            });
            return;
        }
        const newCategory = yield (0, categoriesService_1.createCategoryService)(categoryData);
        res.status(201).json({ message: "Categoría creada exitosamente", category: newCategory });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al crear la categoría"
        });
    }
});
exports.createCategory = createCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID debe ser un número válido" });
            return;
        }
        yield (0, categoriesService_1.deleteCategoryService)(id);
        res.status(200).json({
            message: "Categoría eliminada exitosamente",
        });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Error al eliminar la categoría",
        });
    }
});
exports.deleteCategory = deleteCategory;
