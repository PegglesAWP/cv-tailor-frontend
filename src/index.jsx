import React from 'react';
import ReactDOM from 'react-dom'; // Use ReactDOM instead of ReactDOM.createRoot
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { ResumeProvider } from './contexts/ResumeContext';
import { DocumentProvider } from './contexts/DocumentContext';
import './main.css';

// Render the application using ReactDOM.render
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <DocumentProvider>
            <AppRoutes />
          </DocumentProvider>
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root') // Pass the root element here
);