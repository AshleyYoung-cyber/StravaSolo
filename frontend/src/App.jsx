import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './context/AuthContext';
import Routes from './Routes';
import Runs from './pages/Runs';
import AddRun from './pages/AddRun';

export default function App() {
  return (
    <MantineProvider>
      <Notifications />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/runs" element={<Runs />} />
            <Route path="/runs/add" element={<AddRun />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
} 