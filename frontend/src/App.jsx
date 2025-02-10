import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Runs from './pages/Runs';
import AddRun from './pages/AddRun';
import Goals from './pages/Goals';
import AddGoal from './pages/AddGoal';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/runs" element={<Runs />} />
            <Route path="/add-run" element={<AddRun />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/goals/add" element={<AddGoal />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App; 