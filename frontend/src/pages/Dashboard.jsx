import { useState, useEffect } from 'react';
import { AppShell, Container, Title, Grid, Loader, Text } from '@mantine/core';
import Header from '../components/Header';
import GoalProgress from '../components/GoalProgress';
import RecentRuns from '../components/RecentRuns';
import goalService from '../services/goalService';

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        console.log('Fetching goals...');
        const activeGoals = await goalService.getActiveGoals();
        console.log('Received goals:', activeGoals);
        setGoals(activeGoals);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Failed to load goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  return (
    <AppShell>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" mt="xl">
          <Title order={1} mb="xl">Dashboard</Title>

          <Grid>
            {/* Goals Section */}
            <Grid.Col span={12}>
              <Title order={2} size="h3" mb="md">Active Goals</Title>
              {loading ? (
                <Loader />
              ) : error ? (
                <Text color="red">{error}</Text>
              ) : goals.length > 0 ? (
                goals.map(goal => (
                  <GoalProgress key={goal.id} goal={goal} />
                ))
              ) : (
                <Text color="dimmed">No active goals</Text>
              )}
            </Grid.Col>

            {/* Recent Runs Section */}
            <Grid.Col span={12} mt="xl">
              <RecentRuns />
            </Grid.Col>
          </Grid>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 