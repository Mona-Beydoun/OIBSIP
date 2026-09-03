import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('pizzelo_admin_token');
  const userToken = localStorage.getItem('pizzelo_token');

  // Prefer the admin token if one is present (covers /admin/* and /inventory/* edit routes),
  // otherwise fall back to the customer token.
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

export default api;