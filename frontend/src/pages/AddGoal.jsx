import { AppShell, Container, Button, TextInput, Select, Group, Title, Stack, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import goalService from '../services/goalService';
import Header from '../components/Header';

export default function AddGoal() {
  const navigate = useNavigate();
  const [goalType, setGoalType] = useState('');
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState('mi');
  const [time, setTime] = useState('');

  // Prevent scroll wheel from changing number input
  const handleWheel = (e) => {
    e.target.blur();
  };

  const formatTime = (input) => {
    // Remove all non-digits
    const numbers = input.replace(/\D/g, '');
    
    // Don't format if empty
    if (!numbers) return '';
    
    // Handle different lengths
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}:${numbers.slice(4, 6)}`;
    }
  };

  const handleTimeChange = (e) => {
    const formatted = formatTime(e.target.value);
    if (formatted.length <= 8) { // Don't allow more than HH:MM:SS
      setTime(formatted);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!goalType) {
        throw new Error('Please select a goal type');
      }

      let goalData;
      if (goalType === 'pr') {
        goalData = {
          type: 'DISTANCE',
          target: Number(distance),
          unit: unit,
          time: time,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          timeframe: 'PR'
        };
      } else if (goalType === 'mileage') {
        goalData = {
          type: 'DISTANCE',
          target: Number(distance),
          timeframe: 'WEEKLY',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
      }

      console.log('Sending goal data:', goalData);
      const response = await goalService.createGoal(goalData);
      console.log('Response:', response);

      notifications.show({
        title: 'Success',
        message: 'Goal created successfully',
        color: 'green'
      });
      navigate('/goals');
    } catch (error) {
      console.error('Error creating goal:', error);
      console.error('Error response:', error.response?.data);
      notifications.show({
        title: 'Error',
        message: error.response?.data?.errors?.[0]?.msg || error.message || 'Failed to create goal',
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
          <Stack spacing="xl">
            <Title order={2}>Add New Goal</Title>
            
            <Box sx={{ position: 'static' }}>
              <Select
                label="What type of goal would you like to set?"
                placeholder="Select a goal type"
                data={[
                  { value: 'pr', label: 'Personal Record' },
                  { value: 'mileage', label: 'Mileage' },
                  { value: 'race', label: 'Race' }
                ]}
                value={goalType}
                onChange={setGoalType}
                styles={{
                  dropdown: {
                    position: 'absolute',
                    zIndex: 9999
                  }
                }}
              />
            </Box>

            {goalType === 'pr' && (
              <>
                <Group grow>
                  <Box sx={{ position: 'relative' }}>
                    <TextInput
                      label="Distance"
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      onWheel={handleWheel}
                      rightSection={
                        <Box sx={{ position: 'static', zIndex: 9999 }}>
                          <Select
                            value={unit}
                            onChange={setUnit}
                            data={[
                              { value: 'mi', label: 'mi' },
                              { value: 'km', label: 'km' }
                            ]}
                            styles={{
                              dropdown: {
                                position: 'absolute',
                                zIndex: 9999
                              }
                            }}
                            sx={{ width: 80 }}
                          />
                        </Box>
                      }
                    />
                  </Box>
                  <TextInput
                    label="Time"
                    placeholder="HH:MM:SS"
                    value={time}
                    onChange={handleTimeChange}
                  />
                </Group>
              </>
            )}

            {goalType === 'mileage' && (
              <TextInput
                label="Target (miles)"
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                onWheel={handleWheel}
              />
            )}

            <Group>
              <Button onClick={() => navigate('/goals')}>Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!goalType || !distance || (goalType === 'pr' && !time)}
              >
                Create Goal
              </Button>
            </Group>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 