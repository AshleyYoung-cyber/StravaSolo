// src/pages/AddGoal.jsx
import React from 'react';
import { Container, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import goalService from '../services/goalService'; // Adjust path if needed
import GoalForm from '../components/GoalForm'; // Adjust path if needed

export default function AddGoal() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      console.log('Submitting goal with values:', values);
      const response = await goalService.createGoal(values);
      console.log('Server response:', response);

      notifications.show({
        title: 'Success',
        message: 'Goal created successfully!',
        color: 'green',
      });
      //Move navigate, so it is only called after a successful response.
      navigate('/goals');
    } catch (error) {
      console.error('Error creating goal:', error);
      // ... (rest of your error handling)
    }
  };

  return (
    <Container size="sm">
      <Title order={2} mb="xl">
        Add New Goal
      </Title>
      <GoalForm onSubmit={handleSubmit} />
    </Container>
  );
}