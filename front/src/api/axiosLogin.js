 import axiosInstance from "./axiosInstance.js";
 const loginUser = async (data) => {
      const response = await axiosInstance.post('/users/login', {
        username: data.email,
        password: data.password,
      })
      return response
    }
  export default loginUser