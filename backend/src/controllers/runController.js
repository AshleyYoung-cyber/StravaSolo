const { Run } = require('../models');
const pool = require('../db');

const runController = {
  // Get all runs for logged in user
  async getAllRuns(req, res) {
    try {
      console.log('Fetching runs for user:', req.user.id);
      
      const result = await pool.query(
        'SELECT * FROM runs WHERE user_id = $1 ORDER BY date DESC',
        [req.user.id]
      );
      
      console.log('Runs found:', result.rows.length);
      res.json(result.rows);
    } catch (error) {
      console.error('Detailed error fetching runs:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Error fetching runs', details: error.message });
    }
  },

  // Get single run for logged in user
  async getRun(req, res) {
    try {
      console.log('getRun called with id:', req.params.id, 'for user:', req.user.id);
      
      const run = await Run.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id
        }
      });
      
      console.log('Run found:', run); // Debug log
      
      if (!run) {
        console.log('No run found with id:', req.params.id); // Debug log
        return res.status(404).json({ error: 'Run not found' });
      }
      
      console.log('Sending run data:', run); // Debug log
      res.json(run);
    } catch (error) {
      console.error('Error fetching run:', error);
      res.status(500).json({ error: 'Error fetching run', details: error.message });
    }
  },

  // Create new run
  async createRun(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const { distance, duration, date, type, location, notes } = req.body;
      const userId = req.user.id;

      // Insert the run
      const runResult = await client.query(
        `INSERT INTO runs (user_id, distance, duration, date, type, location, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, distance, duration, date, type, location, notes]
      );

      const run = runResult.rows[0];

      // Check if this run completes any goals
      const goalsResult = await client.query(
        `SELECT * FROM goals 
         WHERE user_id = $1 
         AND completed = FALSE`,
        [userId]
      );

      // Logic to check if run completes any goals will go here
      // We'll implement this next

      await client.query('COMMIT');
      res.status(201).json(run);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createRun:', error);
      res.status(400).json({
        errors: [{
          msg: error.message
        }]
      });
    } finally {
      client.release();
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