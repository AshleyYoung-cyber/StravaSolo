import { useState, useEffect } from 'react';
import { AppShell, Container, Title, Button, Group, Table, Text, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RunForm from '../components/RunForm';
import { runService } from '../services/runService';

export default function Runs() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpened, setFormOpened] = useState(false);
  const navigate = useNavigate();

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
      setLoading(true);
      await runService.createRun(formData);
      notifications.show({
        title: 'Success',
        message: 'Run added successfully',
        color: 'green'
      });
      await loadRuns();
      setFormOpened(false);
    } catch (error) {
      console.error('Error creating run:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create run',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format duration from seconds to HH:MM:SS
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Helper function to format pace (seconds per km) to MM:SS
  const formatPace = (secondsPerKm) => {
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = secondsPerKm % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
  };

  const handleRowClick = (runId) => {
    navigate(`/runs/${runId}`);
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
            <Title>My Runs</Title>
            <Button onClick={() => setFormOpened(true)}>Add New Run</Button>
          </Group>

          <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />
            
            {runs.length === 0 && !loading ? (
              <Text c="dimmed">No runs recorded yet.</Text>
            ) : (
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Distance (km)</th>
                    <th>Duration</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr 
                      key={run.id} 
                      onClick={() => handleRowClick(run.id)}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      <td>{new Date(run.date).toLocaleDateString()}</td>
                      <td>{run.distance.toFixed(2)}</td>
                      <td>{formatDuration(run.duration)}</td>
                      <td>{run.type ? run.type.replace('_', ' ') : 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>

          <RunForm
            opened={formOpened}
            onClose={() => setFormOpened(false)}
            onSubmit={handleSubmit}
          />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 