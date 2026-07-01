import {Request, Response} from "express";
import {ICategory} from "../interfaces/ICategory";
import { createCategoryService, getAllCategoriesService, getCategoryByIdService, deleteCategoryService, updateCategoryPriceService } from "../services/categoriesService";

// GET /categories => Obtener el listado de todas las categorías.
export const getAllCategories = async (req: Request, res: Response) => {

    try {
       
        const categories: ICategory[] = await getAllCategoriesService();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las categorías" });
    }
};

// GET /categories/:id => Obtener el detalle de una categoría específica.
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id as string);
        const categoryData = await getCategoryByIdService(id);
        res.status(200).json(categoryData);
    } catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Error al obtener la categoría" 
        });
    }
}

export const createCategory = async (req: Request, res: Response) => {
    try {
        const categoryData = req.body;

         if (!categoryData.name || !categoryData.duration || !categoryData.price) {
      res.status(400).json({
        message: "Faltan campos requeridos: name, duration, price",
      });
      return;
    }
        const newCategory = await createCategoryService(categoryData);
        res.status(201).json({ message: "Categoría creada exitosamente", category: newCategory });
    } catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Error al crear la categoría" 
        });
    }
}

// PUT /categories/:id => Actualizar el precio de una categoría (solo admin).
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id as string);

        if (isNaN(id)) {
            res.status(400).json({ message: "ID debe ser un número válido" });
            return;
        }

        const { price } = req.body;
        if (price === undefined || price === null) {
            res.status(400).json({ message: "Falta el campo requerido: price" });
            return;
        }

        const updatedCategory = await updateCategoryPriceService(id, Number(price));
        res.status(200).json({ message: "Precio actualizado exitosamente", category: updatedCategory });
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Error al actualizar la categoría"
        });
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
      try {
    const id: number = parseInt(req.params.id as string);

    if (isNaN(id)) {
      res.status(400).json({ message: "ID debe ser un número válido" });
      return;
    }

    await deleteCategoryService(id);

    res.status(200).json({
      message: "Categoría eliminada exitosamente",
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Error al eliminar la categoría",
    });
  }
};