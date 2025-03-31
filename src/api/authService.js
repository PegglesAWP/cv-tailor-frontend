import client from './client';

// Register new user
export const register = async (userData) => {
  const response = await client.post('/auth/register', userData);
  return response.data;
};

// Login user and get token
export const login = async (credentials) => {
  const response = await client.post('/auth/login', credentials);
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