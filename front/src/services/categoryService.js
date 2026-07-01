import axiosInstance from '../api/axiosInstance';

// Helper para no repetir la estructura del header de autenticación
const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// GET /categories — listado de servicios de la barbería
export const getCategories = () => axiosInstance.get('/categories');

// PUT /categories/:id — actualiza el precio de un servicio (solo admin)
export const updateCategory = (id, data, token) =>
  axiosInstance.put(`/categories/${id}`, data, authHeader(token));
