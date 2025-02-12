import { Container, Title } from '@mantine/core';
import GoalForm from '../components/GoalForm';
import goalService from '../services/goalService';
import { useNavigate } from 'react-router-dom';

export default function NewGoal() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      console.log('Form values being submitted:', values);
      
      // Transform the form data based on goal type
      let goalData = {
        type: values.type,
        data: {}
      };

      // Handle different goal types
      switch (values.type) {
        case 'distance':
          goalData.data = {
            target_distance: values.target,
            current_distance: 0,
            distance_unit: values.unit,
            start_date: values.startDate,
            end_date: values.endDate
          };
          break;
        case 'race':
          goalData.data = {
            race_name: values.raceName,
            race_date: values.raceDate,
            race_location: values.raceLocation,
            start_date: values.startDate,
            end_date: values.endDate
          };
          break;
        case 'PR':
          goalData.data = {
            target_distance: values.target,
            target_time: values.targetTime,
            start_date: values.startDate,
            end_date: values.endDate
          };
          break;
      }

      console.log('Transformed goal data:', goalData);
      await goalService.createGoal(goalData);
      navigate('/goals');
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  return (
    <Container size="sm">
      <Title order={2} mb="xl">Create New Goal</Title>
      <GoalForm onSubmit={handleSubmit} />
    </Container>
  );
} 