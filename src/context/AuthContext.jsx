import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('luxe_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('luxe_token') || null);

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:4001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false, error: err.error || 'Login failed' };
      }
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('luxe_token', data.token);
      localStorage.setItem('luxe_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:4001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) return { success: false, error: (await res.json()).error };
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('luxe_token', data.token);
      localStorage.setItem('luxe_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('luxe_token');
    localStorage.removeItem('luxe_user');
  };

  const getAuthHeader = () => (token ? { Authorization: `Bearer ${token}` } : {});

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout, getAuthHeader }}>
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
