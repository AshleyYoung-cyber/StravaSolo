import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/runs';

const runService = {
  getAllRuns: async () => {
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

  getRun: async (id) => {
    console.log('runService.getRun called with id:', id);
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getRun:', error);
      throw error;
    }
  },

  createRun: async (runData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(BASE_URL, runData, {
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

  updateRun: async (id, runData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, runData);
    return response.data;
  },

  deleteRun: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};

export default runService; 