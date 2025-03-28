// Create this file as src/api/config.js

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = {
  baseURL: API_URL,
  endpoints: {
    health: '/health',
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    profile: '/api/v1/users/me',
    documents: '/api/v1/documents',
    experiences: '/api/v1/experiences',
    generate: '/api/v1/ai_generation/generate',
    payment: '/api/v1/payments'
  },
  headers: {
    'Content-Type': 'application/json',
  },
  withAuth: (token) => ({
    ...api.headers,
    'Authorization': `Bearer ${token}`
  })
};

export default api;