import api from './api';
import adminApi from './adminApi';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/my');
  return response.data;
};

export const getAllOrdersAdmin = async () => {
  const response = await adminApi.get('/orders/admin/all');
  return response.data;
};

export const updateOrderStatusAdmin = async (orderId, status) => {
  const response = await adminApi.put(`/orders/admin/${orderId}/status`, { status });
  return response.data;
};