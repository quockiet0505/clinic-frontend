import axios from 'axios';
import { handleApiErrorToast, handleApiSuccessToast } from '@/utils/apiToast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

axiosInstance.interceptors.request.use(
  (config) => {
    NProgress.start();
    const token = sessionStorage.getItem('clinic_token');
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

axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();
    handleApiSuccessToast(response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('clinic_token');
      localStorage.removeItem('clinic_user');
      sessionStorage.removeItem('clinic_token');
      sessionStorage.removeItem('clinic_user');
      window.location.href = '/login';
    } else {
      handleApiErrorToast(error);
    }
    NProgress.done();
    return Promise.reject(error);
  }
);

export default axiosInstance;
