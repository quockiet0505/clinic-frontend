import axios from 'axios';
import { keysToCamel } from '../utils/caseConverter';
import { handleApiErrorToast, handleApiSuccessToast } from '@/utils/apiToast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
});

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

axiosInstance.interceptors.request.use(
  (config) => {
    NProgress.start();
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Tự động convert response data từ snake_case sang camelCase
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = keysToCamel(response.data);
    }
    NProgress.done();
    handleApiSuccessToast(response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.startsWith('/auth/')) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }

    if (error.response && error.response.data) {
      error.response.data = keysToCamel(error.response.data);
    }
    NProgress.done();
    handleApiErrorToast(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;