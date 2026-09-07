import api from './api';

export const createRazorpayOrder = async (totalPrice) => {
  const response = await api.post('/payment/create-order', { totalPrice });
  return response.data;
};

export const verifyPayment = async (paymentPayload) => {
  const response = await api.post('/payment/verify', paymentPayload);
  return response.data;
};