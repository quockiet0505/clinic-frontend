import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: gắn token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clinic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: xử lý 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('clinic_token');
      localStorage.removeItem('clinic_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;