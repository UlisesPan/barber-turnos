import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/Auth/AuthContext';
import { getCategories, updateCategory } from '../../services/categoryService';

export const useManageServices = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [services, setServices] = useState([]);   // [{ id, name, price, ... }]
  const [prices, setPrices] = useState({});        // { [id]: valorEditable }
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);  // id de la categoría que se está guardando
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Guard de vista: solo el admin puede gestionar precios
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/');
  }, [user, navigate]);

  // Carga inicial de servicios
  useEffect(() => {
    getCategories()
      .then((res) => {
        setServices(res.data);
        // Inicializo el valor editable de cada precio
        setPrices(Object.fromEntries(res.data.map((s) => [s.id, s.price])));
      })
      .catch(() => setError('No se pudieron cargar los servicios.'))
      .finally(() => setLoading(false));
  }, []);

  const handlePriceChange = (id, value) => {
    setPrices((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (service) => {
    const newPrice = Number(prices[service.id]);
    setError('');
    setSuccess('');

    if (!newPrice || newPrice <= 0) {
      setError(`El precio de "${service.name}" debe ser mayor a 0.`);
      return;
    }

    setSavingId(service.id);
    try {
      const res = await updateCategory(service.id, { price: newPrice }, token);
      const updated = res.data.category;
      // Reflejo el precio actualizado en la lista
      setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, price: updated.price } : s)));
      setPrices((prev) => ({ ...prev, [service.id]: updated.price }));
      setSuccess(`Precio de "${service.name}" actualizado.`);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar el precio.');
    } finally {
      setSavingId(null);
    }
  };

  return {
    services,
    prices,
    loading,
    savingId,
    error,
    success,
    navigate,
    handlePriceChange,
    handleSave,
  };
};
