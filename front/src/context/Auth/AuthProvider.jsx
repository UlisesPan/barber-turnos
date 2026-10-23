import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthContext from './AuthContext.js';
import { AUTH_EXPIRED_EVENT } from '../../api/axiosInstance';

const readStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') ?? 'null');
    if (token && user) return { user, token };
  } catch {
    // localStorage corrupto o inaccesible: arrancamos deslogueados
  }
  return { user: null, token: null };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth);

  const login = useCallback((user, token) => {
    setAuth({ user, token });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }, []);

  const updateUser = useCallback((changes) => {
    setAuth((prev) => {
      const user = { ...prev.user, ...changes };
      localStorage.setItem('user', JSON.stringify(user));
      return { ...prev, user };
    });
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // El interceptor de axios avisa cuando el backend responde 401 (token vencido o inválido)
  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, logout);
  }, [logout]);

  const value = useMemo(() => ({
    user: auth.user,
    token: auth.token,
    isAuthenticated: !!auth.user,
    isAdmin: auth.user?.role === 'admin',
    login,
    logout,
    updateUser,
  }), [auth, login, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
