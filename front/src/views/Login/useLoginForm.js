import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth/AuthContext';
import { loginUser } from '../../services/authService';
import { apiErrorMessage } from '../../api/axiosInstance';

const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) { setError('El email es obligatorio'); return; }
    if (!formData.password)     { setError('La contraseña es obligatoria'); return; }

    setLoading(true);
    try {
      const response = await loginUser(formData);
      login(response.data.user, response.data.token);
      // Vuelve a la página protegida que pidió el login (o al inicio)
      navigate(location.state?.from ?? '/', { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, 'Email o contraseña incorrectos'));
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, showPassword, loading, error,
    handleChange, handleSubmit,
    togglePassword: () => setShowPassword((prev) => !prev),
  };
};

export default useLoginForm;
