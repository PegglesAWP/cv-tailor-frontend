import apiClient from './client';

const documentService = {
  // Get all documents
  getAllDocuments: async () => {
    const response = await apiClient.get('/documents');
    return response.data;
  },

  // Get a specific document
  getDocument: async (id) => {
    const response = await apiClient.get(`/documents/${id}`);
    return response.data;
  },

  // Create a new document
  createDocument: async (documentData) => {
    const response = await apiClient.post('/documents', documentData);
    return response.data;
  },

  // Update an existing document
  updateDocument: async (id, documentData) => {
    const response = await apiClient.put(`/documents/${id}`, documentData);
    return response.data;
  },

  // Delete a document
  deleteDocument: async (id) => {
    await apiClient.delete(`/documents/${id}`);
  },

  // Generate a document using AI
  generateDocument: async (generationData) => {
    const response = await apiClient.post('/documents/generate', generationData);
    return response.data;
  },
};

export default documentService;