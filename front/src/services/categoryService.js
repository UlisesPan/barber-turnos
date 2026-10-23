import axiosInstance from '../api/axiosInstance';

// GET /categories — servicios de la barbería
export const getCategories = () => axiosInstance.get('/categories');

// PUT /categories/:id — actualiza el precio de un servicio (admin)
export const updateCategory = (id, data) => axiosInstance.put(`/categories/${id}`, data);
