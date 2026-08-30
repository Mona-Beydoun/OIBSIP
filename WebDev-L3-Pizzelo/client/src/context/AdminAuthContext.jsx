import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('pizzelo_admin');
    const storedToken = localStorage.getItem('pizzelo_admin_token');
    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    const data = response.data;
    const { token, ...adminData } = data;

    localStorage.setItem('pizzelo_admin_token', token);
    localStorage.setItem('pizzelo_admin', JSON.stringify(adminData));
    setAdmin(adminData);
    return data;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('pizzelo_admin_token');
    localStorage.removeItem('pizzelo_admin');
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    loginAdmin,
    logoutAdmin,
    isAdminAuthenticated: !!admin,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}