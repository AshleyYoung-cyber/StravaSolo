import { AppShell, Container, Title, Button, Group, Text } from '@mantine/core';
import Header from '../components/Header';

export default function Goals() {
  return (
    <AppShell
      header={<Header />}
      padding="md"
    >
      <Container size="lg">
        <Group position="apart" mb="xl">
          <Title>My Goals</Title>
          <Button>Add New Goal</Button>
        </Group>
        
        {/* We'll add the goals list/cards here later */}
        <Text c="dimmed">No goals set yet.</Text>
      </Container>
    </AppShell>
  );
} 