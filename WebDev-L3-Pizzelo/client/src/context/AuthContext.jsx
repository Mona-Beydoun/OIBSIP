import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if a user session already exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('pizzelo_user');
    const storedToken = localStorage.getItem('pizzelo_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.loginUser(email, password);
    const { token, ...userData } = data;
    localStorage.setItem('pizzelo_token', token);
    localStorage.setItem('pizzelo_user', JSON.stringify(userData));
    setUser(userData);
    return data;
  };

  const register = async (name, email, password) => {
    return await authService.registerUser(name, email, password);
  };

  const logout = () => {
    localStorage.removeItem('pizzelo_token');
    localStorage.removeItem('pizzelo_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}