import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/Auth/AuthContext';

// Redirige al login si no hay sesión, y al inicio si la ruta es solo para admin
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
