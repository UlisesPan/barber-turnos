import axiosInstance from '../api/axiosInstance';

// POST /users/login — el backend espera "username" (usamos el email del form)
export const loginUser = (data) =>
  axiosInstance.post('/users/login', {
    username: data.email,
    password: data.password,
  });

// POST /users/register
export const registerUser = (data) =>
  axiosInstance.post('/users/register', {
    name: data.name,
    email: data.email,
    birthdate: data.birthdate,
    nDni: data.nDni,
    password: data.password,
  });
