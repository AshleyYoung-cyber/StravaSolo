import { useState } from 'react';
import { Modal, TextInput, NumberInput, Button, Group, Select, Text, ScrollArea } from '@mantine/core';
import { Calendar } from '@mantine/dates';

export default function RunForm({ opened, onClose, onSubmit }) {
  console.log('New RunForm rendering...');  // Debug log
  
  const [formData, setFormData] = useState({
    distance: '',
    duration: '',
    date: new Date(),
    time: '07:00',
    type: 'EASY',
    notes: ''
  });

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
    let duration = formData.duration;
    if (duration) {
      const numbers = duration.replace(/\D/g, '');
      const parts = [
        numbers.slice(0, 2) || '00',
        numbers.slice(2, 4) || '00',
        numbers.slice(4, 6) || '00'
      ];
      duration = parts.join(':');
    }
    
    onSubmit({
      ...formData,
      duration
    });
    
    setFormData({
      distance: '',
      duration: '',
      date: new Date(),
      time: '07:00',
      type: 'EASY',
      notes: ''
    });
    onClose();
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Add New Run"
      size="xl"
      withinPortal={false}
      styles={{
        inner: {
          padding: '20px'
        },
        content: {
          maxHeight: '90vh'
        },
        body: {
          padding: '20px'
        }
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

            <Text size="sm" weight={500} mb={3}>Date</Text>
            <Calendar
              value={formData.date}
              onChange={(value) => setFormData({ ...formData, date: value })}
              maxDate={new Date()}
              size="sm"
              mb="md"
            />
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
            
            <Select
              label="Type"
              placeholder="Pick one"
              data={[
                { value: 'EASY', label: 'Easy Run' },
                { value: 'TEMPO', label: 'Tempo Run' },
                { value: 'LONG', label: 'Long Run' },
                { value: 'RACE', label: 'Race' }
              ]}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              mb="md"
              withinPortal={true}
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

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Run</Button>
        </Group>
      </form>
    </Modal>
  );
} 