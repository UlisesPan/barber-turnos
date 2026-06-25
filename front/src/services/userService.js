import axiosInstance from '../api/axiosInstance';

// GET /users — listado de usuarios (lo usa el admin para elegir a quién agendar un turno)
export const getUsers = () => axiosInstance.get('/users');

// PUT /users/:id/photo — sube la foto de perfil. Devuelve res.data (incluye profilePhoto).
export const uploadPhoto = async (userId, file) => {
  const formData = new FormData();
  formData.append('photo', file);
  const res = await axiosInstance.put(`/users/${userId}/photo`, formData);
  return res.data;
};
