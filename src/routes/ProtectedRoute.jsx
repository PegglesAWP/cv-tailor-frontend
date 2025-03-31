import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If the user is not authenticated, redirect to the login page
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;