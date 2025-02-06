import { AppShell, Container, Title, Card, Text, Group, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import goalService from '../services/goalService';
import Header from '../components/Header';

export default function Goals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalService.getAllGoals();
        console.log('Fetched goals:', data);
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch goals',
          color: 'red'
        });
      }
    };

    fetchGoals();
  }, []);

  const renderGoalContent = (goal) => {
    console.log('Rendering goal:', goal);

    if (!goal || !goal.data) {
      return null;
    }

    const { type, target, timeframe, unit, time } = goal.data;

    if (type === 'DISTANCE') {
      if (timeframe === 'PR') {
        return (
          <>
            <Title order={3}>Personal Record Goal</Title>
            <Text>Distance: {target} {unit}</Text>
            <Text>Target Time: {time}</Text>
          </>
        );
      } else {
        return (
          <>
            <Title order={3}>Mileage Goal</Title>
            <Text>Target: {target} miles</Text>
            <Text>Timeframe: {timeframe}</Text>
          </>
        );
      }
    }

    return <Text>Unknown goal type</Text>;
  };

  return (
    <AppShell>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Group position="apart" mb="xl">
            <Title>Goals</Title>
            <Button onClick={() => navigate('/goals/add')}>
              Add New Goal
            </Button>
          </Group>

          {goals.length === 0 ? (
            <Text>No goals yet. Click "Add New Goal" to create one!</Text>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} shadow="sm" p="lg" mb="md">
                {renderGoalContent(goal)}
              </Card>
            ))
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 