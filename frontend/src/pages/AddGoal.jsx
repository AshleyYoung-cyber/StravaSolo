import { AppShell, Container, Button, TextInput, Select, Group, Title, Stack, Box, Radio, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
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
  const [mileageTimeframe, setMileageTimeframe] = useState('WEEKLY');
  const [raceName, setRaceName] = useState('');
  const [raceDate, setRaceDate] = useState(null);
  const [location, setLocation] = useState('');
  const [raceType, setRaceType] = useState('');

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
          unit: unit,
          timeframe: mileageTimeframe,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + (mileageTimeframe === 'WEEKLY' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString()
        };
      } else if (goalType === 'race') {
        // Log form values before processing
        console.log('Raw form values:', {
          raceName,
          raceDate,
          location,
          distance,
          unit,
          raceType
        });

        // Validate form values
        if (!raceName?.trim()) {
          throw new Error('Race name is required');
        }
        if (!raceDate) {
          throw new Error('Race date is required');
        }
        if (!location?.trim()) {
          throw new Error('Location is required');
        }
        if (!distance) {
          throw new Error('Distance is required');
        }
        if (!raceType?.trim()) {
          throw new Error('Race type is required');
        }

        goalData = {
          type: 'RACE',
          name: raceName.trim(),
          date: raceDate.toISOString(),
          location: location.trim(),
          distance: Number(distance),
          unit: unit,
          raceType: raceType.trim(),
          startDate: new Date().toISOString(),
          endDate: raceDate.toISOString()
        };
        
        console.log('Processed goal data:', goalData);
      }

      const response = await goalService.createGoal(goalData);
      console.log('Server response:', response);

      notifications.show({
        title: 'Success',
        message: 'Goal created successfully',
        color: 'green'
      });
      navigate('/goals');
    } catch (error) {
      console.error('Detailed error information:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        receivedData: error.response?.data?.errors?.[0]?.received,
        invalidFields: error.response?.data?.errors?.[0]?.invalidFields
      });
      
      const errorMsg = error.response?.data?.errors?.[0]?.msg || error.message;
      notifications.show({
        title: 'Error',
        message: errorMsg,
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
              <Stack spacing="md">
                <Stack spacing={4}>
                  <Text size="sm" weight={500}>Timeframe</Text>
                  <Radio.Group
                    value={mileageTimeframe}
                    onChange={setMileageTimeframe}
                    style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}
                  >
                    <Radio value="WEEKLY" label="Weekly" />
                    <Radio value="MONTHLY" label="Monthly" />
                  </Radio.Group>
                </Stack>

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
              </Stack>
            )}

            {goalType === 'race' && (
              <Stack spacing="md">
                <TextInput
                  label="Race Name"
                  value={raceName}
                  onChange={(e) => setRaceName(e.target.value)}
                  required
                />

                <Box sx={{ position: 'relative', zIndex: 101 }}>
                  <DateInput
                    label="Race Date"
                    value={raceDate}
                    onChange={setRaceDate}
                    required
                    minDate={new Date()}
                    popoverProps={{ 
                      withinPortal: false,
                      position: "bottom",
                      styles: {
                        dropdown: {
                          position: 'absolute',
                          zIndex: 9999
                        }
                      }
                    }}
                  />
                </Box>

                <TextInput
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />

                <Box sx={{ position: 'relative' }}>
                  <TextInput
                    label="Distance"
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    onWheel={handleWheel}
                    required
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

                <Box sx={{ position: 'relative', zIndex: 100 }}>
                  <Select
                    label="Race Type"
                    value={raceType}
                    onChange={setRaceType}
                    data={[
                      { value: 'road', label: 'Road' },
                      { value: 'trail', label: 'Trail' },
                      { value: 'track', label: 'Track' },
                      { value: 'cross', label: 'Cross Country' }
                    ]}
                    styles={{
                      dropdown: {
                        position: 'absolute',
                        zIndex: 9999
                      }
                    }}
                    required
                  />
                </Box>
              </Stack>
            )}

            <Group>
              <Button onClick={() => navigate('/goals')}>Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={
                  !goalType || 
                  (goalType === 'pr' && (!distance || !time)) ||
                  (goalType === 'mileage' && !distance) ||
                  (goalType === 'race' && (!raceName || !raceDate || !location || !distance || !raceType))
                }
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