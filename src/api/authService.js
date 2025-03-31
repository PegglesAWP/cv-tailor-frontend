import apiClient from './client';

// Register new user
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

// Login user and get token
export const login = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // Store token in localStorage
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }

  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

// Optionally, keep the default export for backward compatibility
const authService = {
  register,
  login,
  logout,
  isLoggedIn,
};

export default authService;