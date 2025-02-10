import React, { useEffect, useState } from 'react';
import { AppShell, Container, Title, Text, Card, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import runService from '../services/runService';

export default function Runs() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);

  const fetchRuns = async () => {
    try {
      const data = await runService.getAllRuns();
      console.log('Fetched runs data:', data);  // Debug log
      setRuns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching runs:', error);
      setRuns([]);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  const handleDelete = async (id) => {
    try {
      await runService.deleteRun(id);
      notifications.show({
        title: 'Success',
        message: 'Run deleted successfully',
        color: 'green'
      });
      fetchRuns();
    } catch (error) {
      console.error('Error deleting run:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete run',
        color: 'red'
      });
    }
  };

  const formatDistance = (distance, unit) => {
    console.log('Formatting distance:', distance, 'with unit:', unit); // Debug log
    const distanceNum = Number(distance);
    const displayUnit = unit || 'miles';
    console.log('Final display unit:', displayUnit); // Debug log
    return `${distanceNum.toFixed(2)} ${displayUnit}`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <AppShell>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container>
          <Group position="apart" mb="xl">
            <Title order={1}>My Runs</Title>
            <Button onClick={() => navigate('/add-run')}>
              Log Run
            </Button>
          </Group>
          
          {runs.length === 0 ? (
            <Text>No runs found. Start logging your runs!</Text>
          ) : (
            runs.map((run) => (
              <Card key={run.id} mb="md" padding="md">
                <Group position="apart">
                  <div>
                    <Text>Distance: {formatDistance(run.distance, run.distance_unit)}</Text>
                    <Text>Duration: {formatDuration(run.duration)}</Text>
                    <Text>Date: {new Date(run.date).toLocaleDateString()}</Text>
                    {run.type && <Text>Type: {run.type}</Text>}
                    {run.location && <Text>Location: {run.location}</Text>}
                    {run.notes && <Text>Notes: {run.notes}</Text>}
                  </div>
                  <Button 
                    color="red" 
                    onClick={() => handleDelete(run.id)}
                    variant="light"
                  >
                    Delete
                  </Button>
                </Group>
              </Card>
            ))
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}