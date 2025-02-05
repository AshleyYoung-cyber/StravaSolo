import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // You could add a loading spinner here
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
} 