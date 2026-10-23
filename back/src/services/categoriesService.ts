import { Category } from "../entities/Category";
import { CategoryModel } from "../config/AppDataSources";
import { ICreateCategoryDto } from "../interfaces/ICategory";
import { conflict, notFound } from "../utils/HttpError";

export const getAllCategoriesService = (): Promise<Category[]> =>
    CategoryModel.find({ order: { price: 'ASC' } });

export const getCategoryByIdService = async (id: number): Promise<Category> => {
    const category = await CategoryModel.findOne({ where: { id } });
    if (!category) throw notFound("Categoría no encontrada");
    return category;
};

export const createCategoryService = async (data: ICreateCategoryDto): Promise<Category> => {
    const existing = await CategoryModel.findOne({ where: { name: data.name } });
    if (existing) throw conflict("Ya existe una categoría con ese nombre");
    return CategoryModel.save(CategoryModel.create(data));
};

export const updateCategoryPriceService = async (id: number, price: number): Promise<Category> => {
    const category = await getCategoryByIdService(id);
    category.price = price;
    return CategoryModel.save(category);
};

export const deleteCategoryService = async (id: number): Promise<void> => {
    const category = await getCategoryByIdService(id);
    try {
        await CategoryModel.remove(category);
    } catch {
        // FK RESTRICT: hay turnos que usan esta categoría
        throw conflict("No se puede eliminar: hay turnos asociados a este servicio");
    }
};
