import axios from 'axios';
import { keysToCamel } from '../utils/caseConverter';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    return response;
  },
  (error) => {
    // Also convert error response data if needed
    if (error.response && error.response.data) {
       error.response.data = keysToCamel(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;