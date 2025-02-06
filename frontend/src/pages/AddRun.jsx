import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell, Container, Title, NumberInput, Button, Select, Textarea } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import Header from '../components/Header';
import runService from '../services/runService';

export default function AddRun() {
  const navigate = useNavigate();
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    try {
      // Validate inputs
      if (!distance || distance <= 0) {
        notifications.show({
          title: 'Error',
          message: 'Please enter a valid distance',
          color: 'red'
        });
        return;
      }

      // Convert hours, minutes, seconds to total seconds
      const h = parseInt(hours || 0);
      const m = parseInt(minutes || 0);
      const s = parseInt(seconds || 0);
      
      if (h === 0 && m === 0 && s === 0) {
        notifications.show({
          title: 'Error',
          message: 'Please enter a duration',
          color: 'red'
        });
        return;
      }

      // Convert to total seconds
      const durationInSeconds = (h * 3600) + (m * 60) + s;

      const runData = {
        distance: Number(distance),
        duration: durationInSeconds,  // Send duration in seconds
        date: date.toISOString(),
        type,
        location,
        notes
      };

      await runService.createRun(runData);
      
      notifications.show({
        title: 'Success',
        message: 'Run logged successfully',
        color: 'green'
      });

      navigate('/runs');
    } catch (error) {
      console.error('Error logging run:', error);
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to log run',
        color: 'red'
      });
    }
  };

  return (
    <AppShell>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm">
          <Title order={1} mb="xl">Log a Run</Title>

          <NumberInput
            label="Distance (miles)"
            value={distance}
            onChange={setDistance}
            min={0}
            precision={2}
            mb="md"
          />

          <Title order={3} mb="sm">Duration</Title>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <NumberInput
              label="Hours"
              value={hours}
              onChange={setHours}
              min={0}
              max={99}
            />
            <NumberInput
              label="Minutes"
              value={minutes}
              onChange={setMinutes}
              min={0}
              max={59}
            />
            <NumberInput
              label="Seconds"
              value={seconds}
              onChange={setSeconds}
              min={0}
              max={59}
            />
          </div>

          <DateTimePicker
            label="Date and Time"
            value={date}
            onChange={setDate}
            mb="md"
          />

          <Select
            label="Type"
            value={type}
            onChange={setType}
            data={[
              { value: 'easy', label: 'Easy Run' },
              { value: 'tempo', label: 'Tempo Run' },
              { value: 'long', label: 'Long Run' },
              { value: 'race', label: 'Race' }
            ]}
            mb="md"
          />

          <Textarea
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            mb="md"
          />

          <Textarea
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            mb="xl"
          />

          <Button onClick={handleSubmit}>Log Run</Button>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 