import { AppShell, Container, Title, Grid, Card, Text, Group, Button } from '@mantine/core';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <AppShell
      header={<Header />}
      padding="md"
    >
      <Container size="lg">
        <Title order={2} mb="xl">Recent Activity</Title>
        
        <Grid>
          {/* Recent Runs */}
          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">Recent Runs</Title>
              <Text c="dimmed" mb="md">No recent runs</Text>
              <Button variant="light" color="blue" fullWidth onClick={() => navigate('/runs')}>
                View All Runs
              </Button>
            </Card>
          </Grid.Col>

          {/* Recent Workouts */}
          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">Recent Workouts</Title>
              <Text c="dimmed" mb="md">No recent workouts</Text>
              <Button variant="light" color="blue" fullWidth onClick={() => navigate('/workouts')}>
                View All Workouts
              </Button>
            </Card>
          </Grid.Col>

          {/* Active Goals */}
          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">Active Goals</Title>
              <Text c="dimmed" mb="md">No active goals</Text>
              <Button variant="light" color="blue" fullWidth onClick={() => navigate('/goals')}>
                View All Goals
              </Button>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </AppShell>
  );
} 