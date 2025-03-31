import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import api from './api';

const apiUrl = import.meta.env.VITE_API_URL;
console.log("API URL:", apiUrl);

function App() {
  const [apiMessage, setApiMessage] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Test API connection
    const testApi = async () => {
      try {
        setError('');
        // Try to reach the root endpoint
        const response = await api.get('/');
        setApiMessage(response.data.message || 'API connected successfully');
      } catch (err) {
        console.error('API Error:', err);
        setError(`API Error: ${err.message}`);
      }
    };
    
    testApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">CV Tailor</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={
              <div>
                <div className="mb-4">Welcome to CV Tailor!</div>
                
                {/* Show API connection status */}
                <div className="mt-8 p-4 border rounded">
                  <h2 className="text-xl font-semibold mb-2">API Connection Status:</h2>
                  {apiMessage && (
                    <div className="text-green-600 mb-2">
                      Success: {apiMessage}
                    </div>
                  )}
                  {error && (
                    <div className="text-red-600 mb-2">
                      {error}
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Backend URL: {import.meta.env.VITE_API_URL || 'Not configured'}</p>
                  </div>
                </div>
              </div>
            } />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;