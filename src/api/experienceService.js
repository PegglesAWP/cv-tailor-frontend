import apiClient from './client';

const experienceService = {
  // Work Experience
  getAllExperiences: async () => {
    const response = await apiClient.get('/profile/experiences');
    return response.data;
  },

  getExperience: async (id) => {
    const response = await apiClient.get(`/profile/experiences/${id}`);
    return response.data;
  },

  createExperience: async (experienceData) => {
    const response = await apiClient.post('/profile/experiences', experienceData);
    return response.data;
  },

  updateExperience: async (id, experienceData) => {
    const response = await apiClient.put(`/profile/experiences/${id}`, experienceData);
    return response.data;
  },

  deleteExperience: async (id) => {
    await apiClient.delete(`/profile/experiences/${id}`);
  },

  // Education
  getAllEducations: async () => {
    const response = await apiClient.get('/profile/educations');
    return response.data;
  },

  getEducation: async (id) => {
    const response = await apiClient.get(`/profile/educations/${id}`);
    return response.data;
  },

  createEducation: async (educationData) => {
    const response = await apiClient.post('/profile/educations', educationData);
    return response.data;
  },

  updateEducation: async (id, educationData) => {
    const response = await apiClient.put(`/profile/educations/${id}`, educationData);
    return response.data;
  },

  deleteEducation: async (id) => {
    await apiClient.delete(`/profile/educations/${id}`);
  },

  // Achievements
  getAllAchievements: async () => {
    const response = await apiClient.get('/profile/achievements');
    return response.data;
  },

  getAchievement: async (id) => {
    const response = await apiClient.get(`/profile/achievements/${id}`);
    return response.data;
  },

  createAchievement: async (achievementData) => {
    const response = await apiClient.post('/profile/achievements', achievementData);
    return response.data;
  },

  updateAchievement: async (id, achievementData) => {
    const response = await apiClient.put(`/profile/achievements/${id}`, achievementData);
    return response.data;
  },

  deleteAchievement: async (id) => {
    await apiClient.delete(`/profile/achievements/${id}`);
  },
};

export default experienceService;