import { AppShell, Group, Button, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { link: '/dashboard', label: 'Dashboard' },
    { link: '/runs', label: 'Runs' },
    { link: '/workouts', label: 'Workouts' },
    { link: '/goals', label: 'Goals' },
  ];

  const items = links.map((link) => (
    <Button
      key={link.label}
      variant="subtle"
      onClick={() => navigate(link.link)}
    >
      {link.label}
    </Button>
  ));

  return (
    <AppShell.Header p="md">
      <Group justify="space-between" h="100%">
        <Group>
          <Text size="xl" fw={700}>SoloStrava</Text>
          <Group ml={50} spacing={5}>
            {items}
          </Group>
        </Group>

        <Group>
          <Text>{user?.email}</Text>
          <Button color="red" onClick={handleLogout}>
            Logout
          </Button>
        </Group>
      </Group>
    </AppShell.Header>
  );
} 