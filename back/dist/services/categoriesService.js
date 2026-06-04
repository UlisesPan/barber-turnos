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
exports.deleteCategoryService = exports.createCategoryService = exports.getCategoryByIdService = exports.getAllCategoriesService = void 0;
const AppDataSources_1 = require("../config/AppDataSources");
const getAllCategoriesService = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield AppDataSources_1.ServiceModel.find({});
    if (!categories)
        return [];
    return categories;
});
exports.getAllCategoriesService = getAllCategoriesService;
const getCategoryByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id || id <= 0) {
        throw new Error("ID debe ser un número válido");
    }
    const category = yield AppDataSources_1.ServiceModel.findOne({
        where: { id }
    });
    if (!category)
        throw new Error("Categoría no encontrada");
    return category;
});
exports.getCategoryByIdService = getCategoryByIdService;
const createCategoryService = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    // Validar que name no esté vacío
    if (!categoryData.name || categoryData.name.trim() === "") {
        throw new Error("El nombre de la categoría es requerido");
    }
    // Validar que duration sea válido
    if (!categoryData.duration || categoryData.duration <= 0) {
        throw new Error("La duración debe ser mayor a 0");
    }
    // Validar que price sea válido
    if (!categoryData.price || categoryData.price <= 0) {
        throw new Error("El precio debe ser mayor a 0");
    }
    // Validar que no exista una categoría con ese nombre
    const existingCategory = yield AppDataSources_1.ServiceModel.findOne({
        where: { name: categoryData.name.trim() },
    });
    if (existingCategory) {
        throw new Error("Ya existe una categoría con ese nombre");
    }
    // ===== CREAR CATEGORÍA =====
    const newCategory = AppDataSources_1.ServiceModel.create({
        name: categoryData.name.trim(),
        duration: categoryData.duration,
        price: categoryData.price,
    });
    const savedCategory = yield AppDataSources_1.ServiceModel.save(newCategory);
    return savedCategory;
});
exports.createCategoryService = createCategoryService;
const deleteCategoryService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield AppDataSources_1.ServiceModel.findOne({ where: { id } });
    if (!category) {
        throw new Error("Categoría no encontrada");
    }
    yield AppDataSources_1.ServiceModel.remove(category);
});
exports.deleteCategoryService = deleteCategoryService;
