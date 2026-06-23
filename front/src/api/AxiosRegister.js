
import axiosInstance from './axiosInstance';

export const registerUser = (data) =>
  axiosInstance.post('/users/register', {
         name: data.name,
        email: data.email,
        birthdate: data.birthdate,
        nDni: data.nDni,
        password: data.password
  });

export const uploadPhoto = async (userId, file) => {
  const formData = new FormData();
    formData.append('photo', file);
  const res = await axiosInstance.put(`/users/${userId}/photo`, formData);
    return res.data;
};