import { Card, Text, Group, Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import goalService from '../services/goalService';

export default function GoalCard({ goal }) {
  const handleDelete = async () => {
    try {
      await goalService.deleteGoal(goal.id);
      window.location.reload(); // Refresh to show updated list
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder mb="md">
      <Group position="apart">
        <div>
          <Text weight={500}>
            {goal.data.target_distance} {goal.data.distance_unit} Goal
          </Text>
          <Text size="sm" color="dimmed">
            {new Date(goal.data.start_date).toLocaleDateString()} - {new Date(goal.data.end_date).toLocaleDateString()}
          </Text>
          <Text size="sm">
            Progress: {goal.data.current_distance}/{goal.data.target_distance} {goal.data.distance_unit}
          </Text>
        </div>
        <Button 
          variant="light" 
          color="red" 
          onClick={handleDelete}
        >
          <IconTrash size={16} />
        </Button>
      </Group>
    </Card>
  );
} 