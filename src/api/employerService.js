import apiClient from './client';

const employerService = {
  // Get all employers
  getAllEmployers: async () => {
    const response = await apiClient.get('/employers');
    return response.data;
  },

  // Get a specific employer
  getEmployer: async (id) => {
    const response = await apiClient.get(`/employers/${id}`);
    return response.data;
  },

  // Scrape employer data from website
  scrapeEmployer: async (url) => {
    const response = await apiClient.post('/employers/scrape', { employer_url: url });
    return response.data;
  },
};

export default employerService;