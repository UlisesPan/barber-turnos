import { useState, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/Auth/AuthContext.jsx';
import { loginUser } from '../../services/authService';

const useLoginForm = () => {
    const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email o contraseña incorrectos');
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