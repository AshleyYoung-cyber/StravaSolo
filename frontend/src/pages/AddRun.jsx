import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell, Container, Title, TextInput, NumberInput, Button, Select, Textarea } from '@mantine/core';
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
      // Convert duration to interval string
      const duration = `${hours || 0}:${minutes || 0}:${seconds || 0}`;
      
      const runData = {
        distance: Number(distance),
        duration,
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
        message: error.response?.data?.errors?.[0]?.msg || 'Failed to log run',
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
          <Title mb="xl">Log a Run</Title>

          <NumberInput
            label="Distance (miles)"
            value={distance}
            onChange={setDistance}
            precision={2}
            min={0}
            step={0.1}
            mb="md"
          />

          <Title order={4} mb="xs">Duration</Title>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <NumberInput
              label="Hours"
              value={hours}
              onChange={setHours}
              min={0}
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

          <TextInput
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