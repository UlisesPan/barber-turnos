import { Request, Response } from "express";
import {
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService,
    deleteCategoryService,
    updateCategoryPriceService,
} from "../services/categoriesService";

export const getAllCategories = async (_req: Request, res: Response) => {
    res.json(await getAllCategoriesService());
};

export const getCategoryById = async (_req: Request, res: Response) => {
    res.json(await getCategoryByIdService(res.locals.id));
};

export const createCategory = async (req: Request, res: Response) => {
    const category = await createCategoryService(req.body);
    res.status(201).json({ message: "Categoría creada exitosamente", category });
};

export const updateCategory = async (req: Request, res: Response) => {
    const category = await updateCategoryPriceService(res.locals.id, req.body.price);
    res.json({ message: "Precio actualizado exitosamente", category });
};

export const deleteCategory = async (_req: Request, res: Response) => {
    await deleteCategoryService(res.locals.id);
    res.json({ message: "Categoría eliminada exitosamente" });
};
