import React, { createContext, useState, useEffect, useContext } from 'react';
import { documentService } from '../api';
import { useAuth } from './AuthContext';

// Create context
const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load documents when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDocuments();
    } else {
      setDocuments([]);
    }
  }, [isAuthenticated]);

  // Load all documents
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const documentsData = await documentService.getAllDocuments();
      setDocuments(documentsData);
      setError(null);
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError('Failed to load your documents');
    } finally {
      setLoading(false);
    }
  };

  // Create a new document
  const createDocument = async (documentData) => {
    try {
      setLoading(true);
      const newDocument = await documentService.createDocument(documentData);
      setDocuments([...documents, newDocument]);
      setError(null);
      return newDocument;
    } catch (err) {
      console.error('Failed to create document:', err);
      setError('Failed to create document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate a document using AI
  const generateDocument = async (generationData) => {
    try {
      setLoading(true);
      const generatedDocument = await documentService.generateDocument(generationData);
      setDocuments([...documents, generatedDocument]);
      setError(null);
      return generatedDocument;
    } catch (err) {
      console.error('Failed to generate document:', err);
      setError('Failed to generate document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a document
  const updateDocument = async (id, documentData) => {
    try {
      setLoading(true);
      const updatedDocument = await documentService.updateDocument(id, documentData);
      setDocuments(
        documents.map((doc) => (doc.id === id ? updatedDocument : doc))
      );
      setError(null);
      return updatedDocument;
    } catch (err) {
      console.error('Failed to update document:', err);
      setError('Failed to update document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (id) => {
    try {
      setLoading(true);
      await documentService.deleteDocument(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
      setError(null);
    } catch (err) {
      console.error('Failed to delete document:', err);
      setError('Failed to delete document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    documents,
    loading,
    error,
    loadDocuments,
    createDocument,
    generateDocument,
    updateDocument,
    deleteDocument,
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

// Custom hook to use the document context
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

export default DocumentContext;