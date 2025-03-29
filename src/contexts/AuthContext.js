import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, userService } from '../api';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (!authService.isLoggedIn()) {
        setLoading(false);
        return;
      }

      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error('Failed to load user:', err);
        setError('Failed to load user profile');
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      const newUser = await authService.register(userData);
      await authService.login(userData.email, userData.password);
      setUser(newUser);
      setError(null);
      return newUser;
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      await authService.login(email, password);
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      setError(null);
      return updatedUser;
    } catch (err) {
      console.error('Update profile failed:', err);
      setError(err.response?.data?.detail || 'Update profile failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;