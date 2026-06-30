import axios from 'axios';
import { keysToCamel } from '../utils/caseConverter';
import { handleApiErrorToast, handleApiSuccessToast } from '@/utils/apiToast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Tự động convert response data từ snake_case sang camelCase
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = keysToCamel(response.data);
    }
    handleApiSuccessToast(response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }

    if (error.response && error.response.data) {
      error.response.data = keysToCamel(error.response.data);
    }
    handleApiErrorToast(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;