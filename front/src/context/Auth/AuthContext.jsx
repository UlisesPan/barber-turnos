import {  useState } from 'react';
import AuthContext from './AuthContext.js'

// Initializer function para cargar estado inicial
const initAuthState = () => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (storedToken && storedUser) {
    return {
      user: JSON.parse(storedUser),
      token: storedToken,
      loading: false,
    };
  }
  
  return {
    user: null,
    token: null,
    loading: false,
  };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initAuthState);

  const login = (userData, userToken) => {
    setAuth({
      user: userData,
      token: userToken,
      loading: false,
    });
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuth({
      user: null,
      token: null,
      loading: false,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    login,
    logout,
    isAuthenticated: !!auth.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
