import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell, Container, Title, Group, Button, Card, Text, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Header from '../components/Header';
import { runService } from '../services/runService';

export default function RunDetails() {
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  console.log('RunDetails rendered, id:', id); // Debug log

  useEffect(() => {
    loadRun();
  }, [id]);

  const loadRun = async () => {
    try {
      console.log('Fetching run with id:', id);
      const data = await runService.getRun(id);
      console.log('Received run data:', data);
      setRun(data);
    } catch (error) {
      console.error('Error loading run:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load run details',
        color: 'red'
      });
      navigate('/runs');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPace = (secondsPerKm) => {
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = secondsPerKm % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
  };

  console.log('Current run state:', run); // Debug log

  if (loading) {
    return (
      <AppShell
        header={<Header />}
      >
        <AppShell.Header>
          <Header />
        </AppShell.Header>

        <AppShell.Main>
          <Container size="lg">
            <LoadingOverlay visible={true} />
          </Container>
        </AppShell.Main>
      </AppShell>
    );
  }

  if (!run) {
    return (
      <AppShell
        header={<Header />}
      >
        <AppShell.Header>
          <Header />
        </AppShell.Header>

        <AppShell.Main>
          <Container size="lg">
            <Text>No run found.</Text>
          </Container>
        </AppShell.Main>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={<Header />}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Group position="apart" mb="xl">
            <Title>Run Details</Title>
            <Button variant="light" onClick={() => navigate('/runs')}>
              Back to Runs
            </Button>
          </Group>

          <Card withBorder p="xl">
            <Group position="apart" mb="md">
              <Text size="xl" weight={500}>
                {new Date(run.date).toLocaleDateString()}
              </Text>
              <Text size="xl" weight={500}>
                {run.type ? run.type.replace('_', ' ') : 'Unknown'}
              </Text>
            </Group>

            <Group grow mb="md">
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Distance</Text>
                <Text size="lg" weight={500}>{run.distance.toFixed(2)} km</Text>
              </Card>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Duration</Text>
                <Text size="lg" weight={500}>{formatDuration(run.duration)}</Text>
              </Card>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Pace</Text>
                <Text size="lg" weight={500}>{formatPace(run.averagePace)}</Text>
              </Card>
            </Group>

            <Card withBorder p="md" mb="md">
              <Text size="sm" color="dimmed">Time</Text>
              <Text size="lg" weight={500}>{run.time}</Text>
            </Card>

            {run.notes && (
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Notes</Text>
                <Text size="lg">{run.notes}</Text>
              </Card>
            )}
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 