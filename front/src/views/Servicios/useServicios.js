import { useState, useEffect } from 'react';
import { getCategories } from '../../services/categoryService';

const useServicios = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getCategories()
      .then((response) => setServices(response.data))
      .catch((error) => console.error('Error al cargar servicios:', error));
  }, []);

  return { services };
};

export default useServicios;
