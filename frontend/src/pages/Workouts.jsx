import { AppShell, Container, Title, Button, Group, Text } from '@mantine/core';
import Header from '../components/Header';

export default function Workouts() {
  return (
    <AppShell
      header={<Header />}
      padding="md"
    >
      <Container size="lg">
        <Group position="apart" mb="xl">
          <Title>My Workouts</Title>
          <Button>Add New Workout</Button>
        </Group>
        
        {/* We'll add the workouts list/table here later */}
        <Text c="dimmed">No workouts recorded yet.</Text>
      </Container>
    </AppShell>
  );
} 