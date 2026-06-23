import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Hardcoded credentials (basic auth)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('luxe_admin_auth') === 'true';
  });

  const login = (username, password) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem('luxe_admin_auth', 'true');
      return { success: true };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos.' };
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('luxe_admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
