import { AppShell, Container, Title, Button, Group, Card, Text, Stack, LoadingOverlay } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import goalService from '../services/goalService';
import Header from '../components/Header';

export default function Goals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const getGoalTypeLabel = (type) => {
    switch(type) {
      case 'TIME':
        return 'Personal Record';
      case 'DISTANCE':
        return 'Distance Goal';
      case 'PACE':
        return 'Pace Goal';
      default:
        return type;
    }
  };

  const renderGoalContent = (goal) => {
    if (!goal || !goal.data) {
      console.log('Invalid goal data:', goal);
      return null;
    }

    console.log('Rendering goal:', goal);

    if (goal.type === 'PR') {
      return (
        <>
          <Text>Distance: {goal.distance} {goal.unit}</Text>
          <Text>Target Time: {goal.targetTime}</Text>
        </>
      );
    } else if (goal.type === 'MILEAGE') {
      return (
        <>
          <Text>Target: {goal.target} miles</Text>
          <Text>Timeframe: {goal.timeframe}</Text>
        </>
      );
    }

    return <Text>Unknown goal type</Text>;
  };

  return (
    <AppShell
      header={<Header />}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Group justify="space-between" mb="xl">
            <Title>Goals</Title>
            <Button onClick={() => navigate('/goals/add')}>
              Add New Goal
            </Button>
          </Group>
          
          <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />
            <Stack spacing="md">
              {goals.length === 0 && !loading ? (
                <Text c="dimmed">No goals set yet.</Text>
              ) : (
                goals.map((goal) => (
                  <Card key={goal.id} withBorder>
                    <Group position="apart">
                      <Text fw={500}>{getGoalTypeLabel(goal.type)}</Text>
                    </Group>
                    <Text mt="xs" c="dimmed">
                      {renderGoalContent(goal)}
                    </Text>
                  </Card>
                ))
              )}
            </Stack>
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 