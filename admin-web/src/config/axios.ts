import axios from 'axios';

// Create an Axios instance
const axiosClient = axios.create({
  baseURL:  'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor (Auto attach Token)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clinic_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor (Handle Token Expiration)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout if token is expired/invalid
      localStorage.removeItem('clinic_token');
      localStorage.removeItem('clinic_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;