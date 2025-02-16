import api from './api';

const getAllGoals = async () => {
  const response = await api.get('/goals');
  return response.data;
};

const getActiveGoals = async () => {
  const response = await api.get('/goals', { params: { status: 'active' } });
  return response.data;
};

const createGoal = async (goalData) => {
  const response = await api.post('/goals', goalData);
  return response.data;
};

const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

export default {
  getAllGoals,
  getActiveGoals,
  createGoal,
  deleteGoal
}; 