import { Container, Title, Button, Group } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container size="lg" py="xl">
      <Group position="apart" mb="xl">
        <Title>Dashboard</Title>
        <Button onClick={handleLogout} color="red">
          Logout
        </Button>
      </Group>
      
      {/* We'll add run/workout/goal sections here later */}
      <Title order={2} mb="md">Recent Activity</Title>
    </Container>
  );
} 