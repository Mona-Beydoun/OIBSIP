import api from './api';

export const getInventory = async () => {
  const response = await api.get('/inventory');
  return response.data;
};

export const updateStockItem = async (category, itemId, updates) => {
  const response = await api.put(`/inventory/${category}/${itemId}`, updates);
  return response.data;
};

export const addStockItem = async (category, item) => {
  const response = await api.post(`/inventory/${category}`, item);
  return response.data;
};