import axios from 'axios';

// Set base URL for all requests
axios.defaults.baseURL = 'http://localhost:3000';  // Make sure this matches your backend port

const BASE_URL = 'http://localhost:3000/api/runs';

const runService = {
  getAllRuns: async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Getting runs with token:', token);

      const response = await axios.get('/api/runs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      console.error('Error fetching runs:', error);
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
      // Log the raw data received
      console.log('1. runService received data:', runData);
      
      // Explicitly check for distance_unit
      console.log('2. distance_unit value:', runData.distance_unit);
      
      // Create a copy of the data to ensure we're not modifying the original
      const dataToSend = {
        ...runData,
        distance_unit: runData.distance_unit // Explicitly include distance_unit
      };
      
      // Log the exact data we're about to send
      console.log('3. Data about to be sent to server:', dataToSend);
      console.log('4. Stringified data:', JSON.stringify(dataToSend));

      const token = localStorage.getItem('token');
      
      const response = await axios.post('/api/runs', dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('5. Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createRun:', {
        message: error.message,
        requestData: runData,
        responseError: error.response?.data
      });
      throw error;
    }
  },

  updateRun: async (id, runData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, runData);
    return response.data;
  },

  deleteRun: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/runs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting run:', error);
      throw error;
    }
  }
};

export default runService; 