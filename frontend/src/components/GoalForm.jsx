import { TextInput, NumberInput, Select, Button, Stack, Group, Box } from '@mantine/core';
import { DateInput, DatesProvider } from '@mantine/dates'; // Import DatesProvider
import { useForm } from '@mantine/form';
import { useState } from 'react'; // Import useState

export default function GoalForm({ onSubmit }) {
  console.log('Rendering form...');

  const [goalType, setGoalType] = useState('distance'); // State for goal type, default to distance

  const form = useForm({
    initialValues: {
      type: 'distance', // Add type to initial values
      target: '',
      unit: 'mi',
      startDate: null, // Initialize dates to null
      endDate: null,
      raceName: '', // add raceName for race goals
      raceLocation: '',// Add raceLocation for race goals
      raceDate: null, // Add raceDate for race goals
      targetTime: '', // Add target time for PR
    },
    validate: {
      target: (value) => (goalType === 'distance' || goalType === 'PR') && !value ? 'Distance is required' : null,
      unit: (value) => (goalType === 'distance') && !value ? 'Unit is required' : null,
      startDate: (value) => (!value ? 'Start date is required' : null),
      endDate: (value) => {
        if (!value) return 'End date is required';
        if (value < form.values.startDate) return 'End date must be after start date';
        return null;
      },
      raceName: (value) => goalType === 'race' && !value ? 'Race name is required' : null, //validate race name
      raceDate: (value) => goalType === 'race' && !value ? 'Race date is required' : null, //validate race date
      raceLocation: (value) => goalType === 'race' && !value ? 'Race location is required' : null, //validate race location
      targetTime: (value) => goalType === 'PR' && !value ? 'Target time is required': null,
    },
  });
  const handleGoalTypeChange = (newGoalType) => {
        setGoalType(newGoalType);
        form.setFieldValue('type', newGoalType);  // Update form values

        // Reset form fields that are not relevant to the new goal type
        if (newGoalType !== 'distance') {
            form.setValues({ ...form.values, unit: '', target: ''});
        }
        if (newGoalType !== 'PR') {
          form.setValues({...form.values, targetTime: ''})
        }
        if (newGoalType !== 'race') {
            form.setValues({ ...form.values, raceName: '', raceDate: null, raceLocation: '' });
        }
    };

    console.log('Form values:', form.values);  // Debug log

  return (
    <DatesProvider settings={{ locale: 'en' }}> {/* Wrap with DatesProvider */}
      <form onSubmit={form.onSubmit((values) => onSubmit({...values, type: goalType}))}>
        <Stack spacing="md">
          <Select
            label="What type of goal would you like to set?"
            placeholder="Select a goal type"
            value={goalType}
            onChange={handleGoalTypeChange} // Use a dedicated handler
            data={[
              { value: 'PR', label: 'Personal Record' },
              { value: 'distance', label: 'Distance' },
              { value: 'race', label: 'Race' },
            ]}
          />

          {goalType === 'distance' && (
            <>
              <NumberInput
                label="Target Distance"
                placeholder="Enter distance"
                min={0}
                {...form.getInputProps('target')}
              />
              <Select
                label="Unit"
                data={[
                  { value: 'mi', label: 'Miles' },
                  { value: 'km', label: 'Kilometers' },
                ]}
                {...form.getInputProps('unit')}
              />
            </>
          )}
          {goalType === 'PR' && (
            <>
              <NumberInput
                label="Target Distance"
                placeholder="Enter distance"
                min={0}
                {...form.getInputProps('target')}
              />
               <TextInput
                label="Target Time (hh:mm:ss)"
                placeholder="Enter target time"
                {...form.getInputProps('targetTime')}
                />
            </>
          )}

            {goalType === 'race' && (
                <>
                    <TextInput
                        label='Race Name'
                        placeholder='Enter race name'
                        {...form.getInputProps('raceName')}
                    />

                    <DateInput
                        label='Race Date'
                        placeholder='Enter race date'
                        value={form.values.raceDate}
                        onChange={(value) => form.setFieldValue('raceDate', value)}
                    />

                    <TextInput
                        label='Race Location'
                        placeholder='Enter race Location'
                        {...form.getInputProps('raceLocation')}
                    />
                </>
            )}

          <DateInput
            label="Start Date"
            placeholder="Pick start date"
            value={form.values.startDate}
            onChange={(value) => form.setFieldValue('startDate', value)}
          />

          <DateInput
            label="End Date"
            placeholder="Pick end date"
            value={form.values.endDate}
            onChange={(value) => form.setFieldValue('endDate', value)}
            minDate={form.values.startDate} // Correctly set minDate
          />

          <Group position="right">
            <Button type="submit">Create Goal</Button>
          </Group>
        </Stack>
      </form>
    </DatesProvider>
  );
}