import api from './api';

export const runService = {
  getAllRuns: async () => {
    try {
      const response = await api.get('/runs');
      return response.data;
    } catch (error) {
      console.error('Error in getAllRuns:', error);
      throw error;
    }
  },

  getRun: async (id) => {
    console.log('runService.getRun called with id:', id);
    try {
      const response = await api.get(`/runs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getRun:', error);
      throw error;
    }
  },

  createRun: async (runData) => {
    try {
      console.log('runService.createRun called with:', runData);
      const response = await api.post('/runs', runData);
      console.log('runService.createRun response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in createRun:', error);
      throw error;
    }
  },

  updateRun: async (id, runData) => {
    const response = await api.put(`/runs/${id}`, runData);
    return response.data;
  },

  deleteRun: async (id) => {
    const response = await api.delete(`/runs/${id}`);
    return response.data;
  }
}; 