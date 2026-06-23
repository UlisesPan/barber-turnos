import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/AxiosRegister';

const validateField = (name, value) => {
  switch (name) {
    case 'name': {
      if (!value.trim())                          return 'El nombre es obligatorio';
      if (value.trim().length < 2)                return 'El nombre debe tener al menos 2 caracteres';
      if (value.trim().length > 70)               return 'El nombre no puede superar los 70 caracteres';
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(value))
                                                  return 'El nombre solo puede contener letras';
      return '';
    }
    case 'email': {
      if (!value.trim())                          return 'El correo es obligatorio';
      if (/\s/.test(value))                       return 'El correo no puede contener espacios';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
                                                  return 'El correo no tiene un formato válido';
      return '';
    }
    case 'birthdate': {
      if (!value)                                 return 'La fecha de nacimiento es obligatoria';
      const birth = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (birth > today)                          return 'La fecha ingresada no es valida';
      if (birth.getFullYear() < 1900)             return 'La fecha ingresada no es valida';
      // Edad mínima 16 años
      return '';
    }
    case 'nDni': {
      if (!value)                                 return 'El DNI es obligatorio';
      if (!/^\d+$/.test(String(value)))           return 'El DNI solo puede contener números';
      if (String(value).length < 7 || String(value).length > 8)
                                                  return 'El DNI debe tener entre 7 y 8 dígitos';
      return '';
    }
    case 'password': {
      if (!value)                                 return 'La contraseña es obligatoria';
      if (value.length < 6)                       return 'La contraseña debe tener al menos 6 caracteres';
      return '';
    }
    default:
      return '';
  }
}


const useRegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', birthdate: '', nDni: '', password: '',
  });
    const [errors, setErrors] = useState({
    name: '', email: '', birthdate: '', nDni: '', password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

       // Validar todos los campos antes de enviar
    const newErrors = {
      name:      validateField('name',      formData.name),
      email:     validateField('email',     formData.email),
      birthdate: validateField('birthdate', formData.birthdate),
      nDni:      validateField('nDni',      formData.nDni),
      password:  validateField('password',  formData.password),
    };
    setErrors(newErrors);

    // Si hay algún error, no continuar
    if (Object.values(newErrors).some((e) => e !== '')) return;

    setLoading(true);
    try {
      await registerUser(formData);
      setSuccess('¡Cuenta creada! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, errors, showPassword, loading, error, success,
    handleChange, handleBlur, handleSubmit,
    togglePassword: () => setShowPassword((prev) => !prev),
  };
};

export default useRegisterForm;