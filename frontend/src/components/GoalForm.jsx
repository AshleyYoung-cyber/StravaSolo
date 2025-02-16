// src/components/GoalForm.jsx
import { TextInput, NumberInput, Select, Button, Stack, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useState } from 'react';

export default function GoalForm({ onSubmit }) {
    const [goalType, setGoalType] = useState('distance');

    const form = useForm({
        initialValues: {
            type: 'distance',
            target: '',
            unit: 'mi',
            startDate: null,
            endDate: null,
            raceName: '',
            raceLocation: '',
            raceDate: null,
            targetTime: '',
        },
        validate: {
            target: (value) => (goalType === 'distance' || goalType === 'PR') && !value ? 'Distance is required' : null,
            unit: (value) => (goalType === 'distance' || goalType ==='PR') && !value ? 'Unit is required' : null,
            startDate: (value) => (!value ? 'Start date is required' : null),
            endDate: (value) => {
                if (!value) return 'End date is required';
                if (value < form.values.startDate) return 'End date must be after start date';
                return null;
            },
            raceName: (value) => goalType === 'race' && !value ? 'Race name is required' : null,
            raceDate: (value) => goalType === 'race' && !value ? 'Race date is required' : null,
            raceLocation: (value) => goalType === 'race' && !value ? 'Location is required' : null,
            targetTime: (value) => goalType === 'PR' && !value ? 'Target time is required' : null,
        },
    });

    const handleGoalTypeChange = (newGoalType) => {
        setGoalType(prevGoalType => {
            form.setFieldValue('type', newGoalType);
            if (newGoalType !== 'distance') {
                form.setValues({ ...form.values, unit: '', target: '' });
            }
            if (newGoalType !== 'PR') {
                form.setValues({ ...form.values, targetTime: '' });
            }
            if (newGoalType !== 'race') {
                form.setValues({ ...form.values, raceName: '', raceDate: null, raceLocation: '' });
            }
            return newGoalType;
        });
    };

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit({ ...values, type: goalType }))}>
            <Stack spacing="md">
                <Select
                    label="What type of goal would you like to set?"
                    placeholder="Select a goal type"
                    value={goalType}
                    onChange={handleGoalTypeChange}
                    data={[
                        { value: 'PR', label: 'Personal Record' },
                        { value: 'distance', label: 'Distance' },
                        { value: 'race', label: 'Race' },
                    ]}
                    withinPortal={false} // Add this line!
                />

                {goalType === 'distance' && (
                    <Group grow>
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
                            withinPortal={false} // Add this line!

                        />
                    </Group>
                )}
                {goalType === 'PR' && (
                  <Group grow>
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
                    </Group>
                )}

                {goalType === 'race' && (
                    <Stack>
                        <TextInput
                            label="Race Name"
                            placeholder="Enter race name"
                            {...form.getInputProps('raceName')}
                        />

                        <DateInput
                            label="Race Date"
                            placeholder="Enter race date"
                            value={form.values.raceDate}
                            onChange={(value) => form.setFieldValue('raceDate', value)}
                        />

                        <TextInput
                            label="Race Location"
                            placeholder="Enter race Location"
                            {...form.getInputProps('raceLocation')}
                        />
                        <Group grow>
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
                                withinPortal={false} // Add this line!
                            />
                        </Group>
                         <Select
                            label="Race Type"
                            placeholder='Select race type'
                            data={[
                              { value: 'road', label: 'Road' },
                              { value: 'trail', label: 'Trail' },
                              { value: 'track', label: 'Track' },
                              { value: 'cross', label: 'Cross Country' }
                            ]}
                            {...form.getInputProps('raceType')}
                            withinPortal={false} // Add this line!
                        />
                    </Stack>
                )}
                <Group grow>
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
                    minDate={form.values.startDate}
                  />
                </Group>


                <Group position="right">
                    <Button type="submit">Create Goal</Button>
                </Group>
            </Stack>
        </form>
    );
}