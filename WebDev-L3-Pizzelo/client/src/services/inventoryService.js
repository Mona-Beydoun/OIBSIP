import api from './api';
import adminApi from './adminApi';

export const getInventory = async () => {
  const response = await api.get('/inventory');
  return response.data;
};

export const updateStockItem = async (category, itemId, updates) => {
  const response = await adminApi.put(`/inventory/${category}/${itemId}`, updates);
  return response.data;
};

export const addStockItem = async (category, item) => {
  const response = await adminApi.post(`/inventory/${category}`, item);
  return response.data;
};