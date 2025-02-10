import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell, Container, Title, NumberInput, Button, Select, Textarea, Box, SegmentedControl, Stack, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import Header from '../components/Header';
import runService from '../services/runService';

export default function AddRun() {
  const navigate = useNavigate();
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('miles');
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleUnitChange = (value) => {
    console.log('Unit selection changed to:', value);
    setDistanceUnit(value);
  };

  const handleSubmit = async () => {
    try {
      console.log('Submit started - Current unit:', distanceUnit);

      if (!distance || distance <= 0) {
        notifications.show({
          title: 'Error',
          message: 'Please enter a valid distance',
          color: 'red'
        });
        return;
      }

      const durationInSeconds = (parseInt(hours || 0) * 3600) + 
                              (parseInt(minutes || 0) * 60) + 
                              parseInt(seconds || 0);

      if (durationInSeconds === 0) {
        notifications.show({
          title: 'Error',
          message: 'Please enter a duration',
          color: 'red'
        });
        return;
      }

      const runData = {
        distance: Number(distance),
        duration: durationInSeconds,
        date: date.toISOString(),
        type,
        location,
        notes,
        distance_unit: distanceUnit  // Use the selected unit
      };

      console.log('Submitting run data:', JSON.stringify(runData, null, 2));

      await runService.createRun(runData);
      
      notifications.show({
        title: 'Success',
        message: 'Run logged successfully',
        color: 'green'
      });

      navigate('/runs');
    } catch (error) {
      console.error('Error submitting run:', error);
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
        <Container size="sm" mt="xl">
          <Title order={1} mb="xl">Log a Run</Title>

          <Stack spacing="md">
            <Box>
              <NumberInput
                label="Distance"
                value={distance}
                onChange={setDistance}
                min={0}
                precision={2}
                mb="sm"
              />
              
              <SegmentedControl
                value={distanceUnit}
                onChange={handleUnitChange}
                data={[
                  { label: 'Miles', value: 'miles' },
                  { label: 'Kilometers', value: 'km' }
                ]}
                fullWidth
                mb="md"
              />
            </Box>

            <DateTimePicker
              label="Date and Time"
              value={date}
              onChange={setDate}
            />

            <Box>
              <Title order={3} size="h6" mb="xs">Duration</Title>
              <Box style={{ display: 'flex', gap: '1rem' }}>
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
              </Box>
            </Box>

            <Select
              label="Type"
              value={type}
              onChange={setType}
              data={[
                { value: 'easy', label: 'Easy' },
                { value: 'tempo', label: 'Tempo' },
                { value: 'interval', label: 'Interval' },
                { value: 'long', label: 'Long Run' },
                { value: 'race', label: 'Race' }
              ]}
            />

            <TextInput
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Textarea
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <Button onClick={handleSubmit} fullWidth>
              Log Run
            </Button>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 