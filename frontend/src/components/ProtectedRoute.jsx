import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  console.log('Protected Route - Current user:', user); // Add logging
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
} 