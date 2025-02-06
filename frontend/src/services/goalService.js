import api from './api';

export default {
  async getAllGoals() {
    const response = await api.get('/goals');
    return response.data;
  },

  async createGoal(goalData) {
    try {
      // Log the exact data being sent
      console.log('Sending to API:', {
        url: '/goals',
        method: 'POST',
        data: goalData,
        headers: api.defaults.headers
      });

      const response = await api.post('/goals', goalData);
      return response.data;
    } catch (error) {
      // Log detailed error information
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error;
    }
  },

  async updateGoal(id, goalData) {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  async deleteGoal(id) {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
}; 