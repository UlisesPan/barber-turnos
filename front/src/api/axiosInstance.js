import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;
export const AUTH_EXPIRED_EVENT = 'auth:expired';

const axiosInstance = axios.create({ baseURL: API_URL });

// Adjunta el token a todas las requests (los services no tienen que pasarlo)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token vencido/inválido → se avisa al AuthProvider para cerrar sesión
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = Boolean(error.config?.headers?.Authorization);
    if (error.response?.status === 401 && hadToken) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

export const photoUrl = (filename) => (filename ? `${API_URL}/uploads/${filename}` : null);

// Mensaje de error del backend o uno por defecto
export const apiErrorMessage = (err, fallback) => err?.response?.data?.message || fallback;

export default axiosInstance;
