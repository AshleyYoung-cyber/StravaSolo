import { useState } from 'react';
import { Modal, TextInput, NumberInput, Button, Group, NativeSelect, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

export default function RunForm({ opened, onClose, onSubmit }) {
  console.log('RunForm rendering'); // Debug log

  const [formData, setFormData] = useState({
    distance: '',
    duration: '',
    date: new Date(),
    time: '07:00',
    type: 'Easy Run',
    notes: ''
  });

  // Debug log current state
  console.log('Current formData:', formData);

  const handleDateChange = (newDate) => {
    console.log('Date change attempted:', newDate); // Debug log
    if (newDate) {
      setFormData(prev => {
        console.log('Updating date from', prev.date, 'to', newDate); // Debug log
        return { ...prev, date: newDate };
      });
    }
  };

  const handleDurationChange = (e) => {
    let { value } = e.target;
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 6) return;
    
    let formatted = numbers;
    if (numbers.length > 2) {
      formatted = numbers.slice(0, 2) + ':' + numbers.slice(2);
    }
    if (numbers.length > 4) {
      formatted = formatted.slice(0, 5) + ':' + formatted.slice(5);
    }
    
    setFormData({ ...formData, duration: formatted });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.distance || !formData.duration || !formData.date) {
        throw new Error('Please fill in all required fields');
      }

      // Convert HH:MM:SS to seconds
      const durationParts = formData.duration.split(':').map(Number);
      if (durationParts.length !== 3) {
        throw new Error('Invalid duration format');
      }
      
      const durationInSeconds = durationParts[0] * 3600 + 
                              durationParts[1] * 60 + 
                              durationParts[2];

      // Calculate average pace (seconds per km)
      const averagePaceInSeconds = Math.round(durationInSeconds / formData.distance);

      // Estimate calories (rough estimate: 60 calories per km)
      const estimatedCalories = Math.round(formData.distance * 60);

      const formattedData = {
        distance: Number(formData.distance),
        duration: durationInSeconds,
        date: formData.date.toISOString().split('T')[0],
        time: formData.time || '07:00',
        type: formData.type.toUpperCase().replace(' ', '_'),
        notes: formData.notes || '',
        averagePace: averagePaceInSeconds,
        calories: estimatedCalories
      };

      console.log('Formatted data for submission:', formattedData);
      onSubmit(formattedData);
    } catch (error) {
      console.error('Form validation error:', error);
      // You can show an error notification here if you want
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Add New Run"
      size="xl"
      styles={{
        header: { marginBottom: 0, paddingBottom: 0 },
        close: {
          width: '30px',
          height: '30px',
          position: 'absolute',
          top: '10px',
          right: '10px'
        },
        content: { maxHeight: '80vh', overflowY: 'auto' },
        body: { padding: '20px' }
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: '20px',
          width: '100%'
        }}>
          <div style={{ flex: 1 }}>
            <NumberInput
              label="Distance (km)"
              placeholder="5.0"
              precision={2}
              min={0}
              step={0.1}
              required
              value={formData.distance}
              onChange={(value) => setFormData({ ...formData, distance: value })}
              mb="md"
            />

            <TextInput
              label="Duration (HH:MM:SS)"
              placeholder="Enter duration"
              description="Just type numbers, colons will be added automatically"
              required
              value={formData.duration}
              onChange={handleDurationChange}
              mb="md"
            />

            <div>
              <Text size="sm" weight={500} mb={3}>Date</Text>
              <DatePicker
                value={formData.date}
                onChange={handleDateChange}
                maxDate={new Date()}
                clearable={false}
                defaultValue={new Date()}
                mb="md"
              />
              <Text size="xs" color="dimmed">
                Selected: {formData.date?.toLocaleDateString()}
              </Text>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <TextInput
              label="Time"
              type="time"
              placeholder="07:00"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              mb="md"
            />
            
            <NativeSelect
              label="Type"
              data={[
                'Easy Run',
                'Tempo Run',
                'Long Run',
                'Race'
              ]}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              mb="md"
            />
            
            <TextInput
              label="Notes"
              placeholder="How was your run?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              mb="xl"
            />
          </div>
        </div>

        <Group justify="flex-end">
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Run</Button>
        </Group>
      </form>
    </Modal>
  );
}