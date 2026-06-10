import {Category} from "../entities/Category";
import {ServiceModel} from "../config/AppDataSources";
import {ICategory, ICreateCategoryDto} from "../interfaces/ICategory";

export const getAllCategoriesService = async (): Promise<Category[]> => {
    
    const categories = await ServiceModel.find({});
    
    if (!categories) return [];
    return categories;
}

export const getCategoryByIdService = async (id: number): Promise<Category> => {
    if (!id || id <= 0) {
    throw new Error("ID debe ser un número válido");
    }
    const category = await ServiceModel.findOne({
        where: { id }
    });
    if (!category) throw new Error("Categoría no encontrada");
    return category;
}

export const createCategoryService = async (categoryData: ICreateCategoryDto): Promise<Category> => {
 
  if (!categoryData.name || categoryData.name.trim() === "") {
    throw new Error("El nombre de la categoría es requerido");
  }

  
  if (!categoryData.duration || categoryData.duration <= 0) {
    throw new Error("La duración debe ser mayor a 0");
  }

 
  if (!categoryData.price || categoryData.price <= 0) {
    throw new Error("El precio debe ser mayor a 0");
  }

  // Validar que no exista una categoría con ese nombre
  const existingCategory = await ServiceModel.findOne({
    where: { name: categoryData.name.trim() },
  });

  if (existingCategory) {
    throw new Error("Ya existe una categoría con ese nombre");
  }

  const newCategory = ServiceModel.create({
    name: categoryData.name.trim(),
    duration: categoryData.duration,
    price: categoryData.price,
  });
    const savedCategory = await ServiceModel.save(newCategory);
    return savedCategory;
}

export const deleteCategoryService = async (id: number): Promise<void> => {
  const category = await ServiceModel.findOne({ where: { id } });

  if (!category) {
    throw new Error("Categoría no encontrada");
  }

  await ServiceModel.remove(category);
};