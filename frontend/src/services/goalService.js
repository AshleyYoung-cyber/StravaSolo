import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/goals';

const goalService = {
  createGoal: async (goalData) => {
    try {
      console.log('Sending goal data:', goalData);
      const token = localStorage.getItem('token');
      const response = await axios.post(BASE_URL, goalData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response);
      throw error;
    }
  },

  getAllGoals: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(BASE_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response);
      throw error;
    }
  },

  updateGoal: async (id, goalData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, goalData);
    return response.data;
  },

  deleteGoal: async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/${goalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response);
      throw error;
    }
  }
};

export default goalService; 