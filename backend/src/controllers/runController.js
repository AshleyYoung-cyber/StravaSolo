const { Run } = require('../models');

const runController = {
  // Get all runs for logged in user
  async getAllRuns(req, res) {
    try {
      console.log('Fetching runs for user:', req.user.id);
      
      const runs = await Run.findAll({
        where: { 
          UserId: req.user.id  // Changed from userId to UserId to match Sequelize convention
        },
        order: [['date', 'DESC']]
      });
      
      console.log('Runs found:', runs.length);
      res.json(runs);
    } catch (error) {
      console.error('Detailed error fetching runs:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Error fetching runs', details: error.message });
    }
  },

  // Get single run by ID
  async getRun(req, res) {
    try {
      console.log('Fetching run with ID:', req.params.id);
      console.log('For user:', req.user.id);
      
      const run = await Run.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id  // Changed from userId to UserId
        }
      });
      
      console.log('Run found:', run);
      
      if (!run) {
        return res.status(404).json({ error: 'Run not found' });
      }
      
      res.json(run);
    } catch (error) {
      console.error('Detailed error fetching run:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Error fetching run', details: error.message });
    }
  },

  // Create new run
  async createRun(req, res) {
    try {
      const { distance, duration, date, averagePace, calories, notes } = req.body;
      
      const run = await Run.create({
        userId: req.user.id,
        distance,
        duration,
        date: date || new Date(),
        averagePace,
        calories,
        notes,
        UserId: req.user.id
      });
      
      res.status(201).json(run);
    } catch (error) {
      console.error('Error creating run:', error);
      res.status(500).json({ error: 'Error creating run' });
    }
  },

  // Update run
  async updateRun(req, res) {
    try {
      console.log('Updating run with ID:', req.params.id);
      console.log('For user:', req.user.id);
      console.log('Update data:', req.body);
      
      const run = await Run.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id  // Changed from userId to UserId
        }
      });
      
      console.log('Run found:', run);
      
      if (!run) {
        return res.status(404).json({ error: 'Run not found' });
      }
      
      const { distance, duration, date, averagePace, calories, notes } = req.body;
      
      const updatedRun = await run.update({
        distance: distance || run.distance,
        duration: duration || run.duration,
        date: date || run.date,
        averagePace: averagePace || run.averagePace,
        calories: calories || run.calories,
        notes: notes || run.notes
      });
      
      console.log('Run updated:', updatedRun);
      res.json(updatedRun);
    } catch (error) {
      console.error('Detailed error updating run:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Error updating run', details: error.message });
    }
  },

  // Delete run
  async deleteRun(req, res) {
    try {
      console.log('Attempting to delete run with ID:', req.params.id);
      console.log('For user:', req.user.id);
      
      const run = await Run.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id  // Changed from userId to UserId
        }
      });
      
      console.log('Run found:', run);
      
      if (!run) {
        return res.status(404).json({ error: 'Run not found' });
      }
      
      await run.destroy();
      console.log('Run successfully deleted');
      
      res.json({ message: 'Run deleted successfully' });
    } catch (error) {
      console.error('Detailed error deleting run:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Error deleting run', details: error.message });
    }
  }
};

module.exports = runController; 