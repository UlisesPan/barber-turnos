import { useState, useEffect } from 'react';
import { getCategories } from '../../services/categoryService';

const useServicios = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then((response) => {
        // Si la API está mal configurada puede volver HTML en vez de un array
        if (!Array.isArray(response.data)) throw new Error('Respuesta inválida');
        setServices(response.data);
      })
      .catch(() => setError('No se pudieron cargar los servicios.'))
      .finally(() => setLoading(false));
  }, []);

  return { services, loading, error };
};

export default useServicios;
