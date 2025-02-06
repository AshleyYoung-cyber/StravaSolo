import { AppShell, Container, Title, TextInput, PasswordInput, Button, Text, Group } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(formData);
      login(data);
      navigate('/dashboard');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Login failed',
        color: 'red'
      });
    }
  };

  return (
    <AppShell>
      <AppShell.Main>
        <Container size="xs" mt="xl">
          <Title order={1} align="center">Login</Title>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              mt="md"
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              mt="md"
            />
            <Group mt="xl">
              <Button type="submit" fullWidth>Login</Button>
            </Group>
            <Text align="center" mt="md">
              Don't have an account? <Link to="/register">Register</Link>
            </Text>
          </form>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 