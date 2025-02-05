import { AppShell, Container, Title, Button, Group, Text } from '@mantine/core';
import Header from '../components/Header';

export default function Runs() {
  return (
    <AppShell
      header={<Header />}
      padding="md"
    >
      <Container size="lg">
        <Group position="apart" mb="xl">
          <Title>My Runs</Title>
          <Button>Add New Run</Button>
        </Group>
        
        {/* We'll add the runs list/table here later */}
        <Text c="dimmed">No runs recorded yet.</Text>
      </Container>
    </AppShell>
  );
} 