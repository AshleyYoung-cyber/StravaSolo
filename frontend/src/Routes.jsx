import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import AddGoal from './pages/AddGoal';
import ProtectedRoute from './components/ProtectedRoute';

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      <Route path="/goals/add" element={<ProtectedRoute><AddGoal /></ProtectedRoute>} />
    </RouterRoutes>
  );
} 