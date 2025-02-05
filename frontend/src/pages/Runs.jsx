import { useState, useEffect } from 'react';
import { AppShell, Container, Title, Button, Group, Text, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Header from '../components/Header';
import RunForm from '../components/RunForm';
import { runService } from '../services/runService';

export default function Runs() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpened, setFormOpened] = useState(false);
  console.log('Runs rendered, formOpened:', formOpened);

  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    try {
      const data = await runService.getAllRuns();
      setRuns(data);
    } catch (error) {
      console.error('Error loading runs:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load runs',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      console.log('Attempting to create run with data:', formData);
      setLoading(true);
      
      const response = await runService.createRun(formData);
      console.log('Run created successfully:', response);
      
      notifications.show({
        title: 'Success',
        message: 'Run added successfully',
        color: 'green'
      });
      
      await loadRuns(); // Reload the runs list
      setFormOpened(false);
    } catch (error) {
      console.error('Error creating run:', error);
      console.error('Error details:', error.response?.data);
      
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create run',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      header={<Header />}
      padding="md"
    >
      <Container size="lg" pos="relative">
        <LoadingOverlay visible={loading} />
        
        <Group position="apart" mb="xl">
          <Title>My Runs</Title>
          <Button onClick={() => setFormOpened(true)}>Add New Run</Button>
        </Group>
        
        {runs.length === 0 ? (
          <Text c="dimmed">No runs recorded yet.</Text>
        ) : (
          // We'll add the runs table here in the next step
          <Text>You have {runs.length} runs recorded.</Text>
        )}

        <RunForm
          opened={formOpened}
          onClose={() => setFormOpened(false)}
          onSubmit={handleSubmit}
        />
      </Container>
    </AppShell>
  );
} 