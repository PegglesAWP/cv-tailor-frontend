import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService } from '../api/authService';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const data = await loginService(credentials.username, credentials.password);
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        const userData = { username: credentials.username };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const data = await registerService(username, email, password);
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        const userData = { username, email };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Create the context value
  const contextValue = {
    user,
    login,
    register,
    logout
  };

  // Return the provider
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Create the hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;