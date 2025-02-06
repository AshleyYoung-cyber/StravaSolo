const pool = require('../db');

const runController = {
  // Get all runs for logged in user
  async getAllRuns(req, res) {
    try {
      console.log('Fetching runs for user:', req.user?.id);
      console.log('Full user object:', req.user);  // Check if user is properly authenticated
      
      if (!req.user || !req.user.id) {
        throw new Error('User not authenticated');
      }

      const result = await pool.query(
        'SELECT * FROM runs WHERE user_id = $1 ORDER BY date DESC',
        [req.user.id]
      );
      
      console.log('Query result:', result);
      console.log('Runs found:', result.rows.length);
      res.json(result.rows);
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Error fetching runs', 
        details: error.message,
        stack: error.stack 
      });
    }
  },

  // Get single run
  async getRun(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM runs WHERE id = $1 AND user_id = $2',
        [req.params.id, req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Run not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching run:', error);
      res.status(500).json({ error: 'Error fetching run', details: error.message });
    }
  },

  // Create new run
  async createRun(req, res) {
    const client = await pool.connect();
    try {
      console.log('Received run data:', req.body);
      
      await client.query('BEGIN');
      
      const { distance, duration, date, type, location, notes } = req.body;
      const userId = req.user.id;

      // Insert the run without average_pace and calories
      const runResult = await client.query(
        `INSERT INTO runs (user_id, distance, duration, date, type, location, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, distance, duration, date, type, location, notes]
      );
      
      const run = runResult.rows[0];
      console.log('Created run:', run);

      // Get all active (uncompleted) goals for this user
      const activeGoals = await client.query(
        `SELECT * FROM goals 
         WHERE user_id = $1 
         AND id NOT IN (
           SELECT goal_id FROM completed_goals WHERE user_id = $1
         )`,
        [userId]
      );

      // Check each goal to see if it's completed by this run
      for (const goal of activeGoals.rows) {
        let isCompleted = false;

        switch (goal.type) {
          case 'RACE':
            // For race goals, check if the distance matches and it's marked as a race
            if (goal.data.distance === run.distance && run.type === 'race') {
              isCompleted = true;
            }
            break;

          case 'DISTANCE':
            if (goal.data.timeframe === 'PR') {
              // For PR goals, check if the distance matches and time is better
              if (goal.data.distance === run.distance) {
                const runTime = run.duration; // Assuming duration is stored in a comparable format
                if (runTime < goal.data.time) {
                  isCompleted = true;
                }
              }
            }
            // Add other distance goal types here
            break;
        }

        // If goal is completed, add to completed_goals table
        if (isCompleted) {
          await client.query(
            `INSERT INTO completed_goals (goal_id, user_id, completing_run_id)
             VALUES ($1, $2, $3)`,
            [goal.id, userId, run.id]
          );
        }
      }

      await client.query('COMMIT');
      
      res.status(201).json({
        run,
        message: 'Run logged successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createRun:', error);
      res.status(400).json({
        error: error.message
      });
    } finally {
      client.release();
    }
  },

  // Update run
  async updateRun(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const { distance, duration, date, type, location, notes } = req.body;
      
      const result = await client.query(
        `UPDATE runs 
         SET distance = COALESCE($1, distance),
             duration = COALESCE($2, duration),
             date = COALESCE($3, date),
             type = COALESCE($4, type),
             location = COALESCE($5, location),
             notes = COALESCE($6, notes)
         WHERE id = $7 AND user_id = $8
         RETURNING *`,
        [distance, duration, date, type, location, notes, req.params.id, req.user.id]
      );

      if (result.rows.length === 0) {
        throw new Error('Run not found');
      }

      await client.query('COMMIT');
      res.json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating run:', error);
      res.status(error.message === 'Run not found' ? 404 : 500)
        .json({ error: error.message });
    } finally {
      client.release();
    }
  },

  // Delete run
  async deleteRun(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        'DELETE FROM runs WHERE id = $1 AND user_id = $2 RETURNING *',
        [req.params.id, req.user.id]
      );

      if (result.rows.length === 0) {
        throw new Error('Run not found');
      }

      await client.query('COMMIT');
      res.json({ message: 'Run deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting run:', error);
      res.status(error.message === 'Run not found' ? 404 : 500)
        .json({ error: error.message });
    } finally {
      client.release();
    }
  }
};

module.exports = runController; 