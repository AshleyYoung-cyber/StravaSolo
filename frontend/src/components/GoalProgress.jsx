import { Card, Text, Progress, Group, Stack } from '@mantine/core';

export default function GoalProgress({ goal }) {
  console.log('Goal data structure:', {
    target: goal.data.target_distance,
    current: goal.data.current_distance,
    unit: goal.data.distance_unit,
    dates: {
      start: goal.data.start_date,
      end: goal.data.end_date
    },
    completed: goal.completed
  });
  
  const progress = (parseFloat(goal.data.current_distance) / parseFloat(goal.data.target_distance)) * 100;
  console.log('Progress calculation:', {
    current: parseFloat(goal.data.current_distance),
    target: parseFloat(goal.data.target_distance),
    progress: progress
  });
  
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack spacing="xs">
        <Text size="lg" weight={500}>Distance Goal</Text>
        
        <Group position="apart" mt="md" mb="xs">
          <Text size="sm" color="dimmed">
            Progress: {goal.data.current_distance}/{goal.data.target_distance} {goal.data.distance_unit}
          </Text>
          <Text size="sm" color={goal.completed ? 'green' : 'blue'}>
            {goal.completed ? 'Completed!' : `${Math.round(progress)}%`}
          </Text>
        </Group>

        <Progress 
          value={progress} 
          color={goal.completed ? 'green' : 'blue'}
          size="xl"
        />

        <Text size="sm" color="dimmed">
          Goal period: {new Date(goal.data.start_date).toLocaleDateString()} - {new Date(goal.data.end_date).toLocaleDateString()}
        </Text>
      </Stack>
    </Card>
  );
} 