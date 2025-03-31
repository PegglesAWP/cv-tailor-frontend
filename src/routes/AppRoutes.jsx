import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layout
import Layout from '../components/Layout';

// Public pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Protected pages
import DashboardPage from '../pages/DashboardPage';
import NewDocumentPage from '../pages/NewDocumentPage';

// Fallback page for 404
import NotFoundPage from '../pages/NotFoundPage';

// Protected route component
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <LoginPage />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <RegisterPage />
          </Layout>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/new"
        element={
          <ProtectedRoute>
            <Layout>
              <NewDocumentPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <Layout>
            <NotFoundPage />
          </Layout>
        }
      />
    </Routes>
  </Router>
);

export default AppRoutes;