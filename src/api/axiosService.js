// Create this file as src/api/axiosService.js
import axios from 'axios';
import api from './config';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: api.baseURL,
  headers: api.headers,
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Health check
  checkHealth: () => axiosInstance.get(api.endpoints.health),
  
  // Auth endpoints
  login: (credentials) => axiosInstance.post(api.endpoints.login, credentials),
  register: (userData) => axiosInstance.post(api.endpoints.register, userData),
  
  // User endpoints
  getProfile: () => axiosInstance.get(api.endpoints.profile),
  updateProfile: (data) => axiosInstance.put(api.endpoints.profile, data),
  
  // Documents endpoints
  getDocuments: () => axiosInstance.get(api.endpoints.documents),
  getDocument: (id) => axiosInstance.get(`${api.endpoints.documents}/${id}`),
  createDocument: (data) => axiosInstance.post(api.endpoints.documents, data),
  
  // Add other API calls as needed
};

export default apiService;