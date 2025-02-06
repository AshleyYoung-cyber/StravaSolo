import { AppShell, Container, Title, Card, Text, Group, Button, ActionIcon } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import goalService from '../services/goalService';
import Header from '../components/Header';
import { IconTrash } from '@tabler/icons-react';

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

  const handleDelete = async (goalId) => {
    try {
      await goalService.deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
      notifications.show({
        title: 'Success',
        message: 'Goal deleted successfully',
        color: 'green'
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete goal',
        color: 'red'
      });
    }
  };

  const renderGoalContent = (goal) => {
    console.log('Rendering goal:', goal);

    if (!goal || !goal.data) {
      return null;
    }

    const { type } = goal;
    const { name, date, location, distance, unit, raceType } = goal.data;

    if (type === 'DISTANCE') {
      if (goal.data.timeframe === 'PR') {
        return (
          <>
            <Title order={3}>Personal Record Goal</Title>
            <Text>Distance: {goal.data.target} {goal.data.unit}</Text>
            <Text>Target Time: {goal.data.time}</Text>
          </>
        );
      } else {
        return (
          <>
            <Title order={3}>Mileage Goal</Title>
            <Text>Target: {goal.data.target} miles</Text>
            <Text>Timeframe: {goal.data.timeframe}</Text>
          </>
        );
      }
    } else if (type === 'RACE') {
      return (
        <>
          <Title order={3}>Race Goal: {name}</Title>
          <Text>Date: {new Date(date).toLocaleDateString()}</Text>
          <Text>Location: {location}</Text>
          <Text>Distance: {distance} {unit}</Text>
          <Text>Type: {raceType}</Text>
        </>
      );
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
                <Group position="apart">
                  <div>{renderGoalContent(goal)}</div>
                  <ActionIcon 
                    color="red" 
                    onClick={() => handleDelete(goal.id)}
                    variant="subtle"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Card>
            ))
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 