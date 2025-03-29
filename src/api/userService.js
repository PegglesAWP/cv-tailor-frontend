import apiClient from './client';

const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  },
};

export default userService;