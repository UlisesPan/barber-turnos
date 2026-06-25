import axiosInstance from '../api/axiosInstance';

// GET /categories — listado de servicios de la barbería
export const getCategories = () => axiosInstance.get('/categories');
