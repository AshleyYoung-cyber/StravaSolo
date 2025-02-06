import { AppShell, Container, Title, Card, Text, Group, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import runService from '../services/runService';
import Header from '../components/Header';

export default function Runs() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const data = await runService.getAllRuns();
        console.log('Fetched runs:', data);
        setRuns(data);
      } catch (error) {
        console.error('Error fetching runs:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch runs',
          color: 'red'
        });
      }
    };

    fetchRuns();
  }, []);

  const formatDuration = (duration) => {
    // PostgreSQL interval comes as "HH:MM:SS"
    return duration;
  };

  return (
    <AppShell>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Group position="apart" mb="xl">
            <Title>Runs</Title>
            <Button onClick={() => navigate('/runs/add')}>
              Log New Run
            </Button>
          </Group>

          {runs.length === 0 ? (
            <Text>No runs logged yet. Click "Log New Run" to add one!</Text>
          ) : (
            runs.map((run) => (
              <Card key={run.id} shadow="sm" p="lg" mb="md">
                <Title order={3}>
                  {new Date(run.date).toLocaleDateString()} - {run.distance} miles
                </Title>
                <Text>Duration: {formatDuration(run.duration)}</Text>
                {run.type && <Text>Type: {run.type}</Text>}
                {run.location && <Text>Location: {run.location}</Text>}
                {run.notes && <Text mt="sm">{run.notes}</Text>}
              </Card>
            ))
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 