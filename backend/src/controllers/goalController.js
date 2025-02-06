const pool = require('../db');
const { handleDatabaseError } = require('../utils/errorHandling');

const validateGoalData = (goalData) => {
  const errors = [];

  if (!goalData.type) {
    errors.push('Goal type is required');
  }

  switch (goalData.type) {
    case 'PR':
      if (!goalData.time) errors.push('Time is required for PR goals');
      if (!goalData.distance) errors.push('Distance is required for PR goals');
      if (!goalData.unit) errors.push('Unit is required for PR goals');
      break;
    case 'VOLUME':
      if (!goalData.period) errors.push('Period is required for volume goals');
      if (!goalData.mileage && !goalData.runs) errors.push('Either mileage or number of runs is required');
      if (goalData.mileage && !goalData.mileageUnit) errors.push('Unit is required when specifying mileage');
      break;
    case 'RACE':
      if (!goalData.name) errors.push('Race name is required');
      if (!goalData.date) errors.push('Race date is required');
      if (!goalData.location) errors.push('Race location is required');
      break;
  }

  return errors;
};

const goalController = {
  // Get all goals for logged in user
  async getAllGoals(req, res) {
    try {
      const userId = req.user.id;
      const query = `
        SELECT * FROM goals 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `;
      const { rows } = await pool.query(query, [userId]);
      res.json(rows);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  },

  // Get single goal
  async getGoal(req, res) {
    try {
      const goal = await Goal.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id
        }
      });
      
      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }
      
      res.json(goal);
    } catch (error) {
      console.error('Error fetching goal:', error);
      res.status(500).json({ error: 'Error fetching goal' });
    }
  },

  // Create new goal
  async createGoal(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const userId = req.user.id;
      const goalData = {
        type: req.body.type,
        name: req.body.name,
        date: req.body.date,
        location: req.body.location,
        distance: Number(req.body.distance),
        raceType: req.body.raceType,
        unit: req.body.unit,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      };

      console.log('Attempting to insert goal with:', {
        userId,
        goalData: JSON.stringify(goalData)
      });

      // First check if we can query the goals table
      try {
        await client.query('SELECT 1 FROM goals LIMIT 1');
      } catch (tableError) {
        console.error('Error accessing goals table:', tableError);
        throw new Error('Database table access error');
      }

      // Try the insert
      try {
        const result = await client.query(
          'INSERT INTO goals (user_id, data) VALUES ($1, $2) RETURNING *',
          [userId, goalData]
        );
        
        console.log('Insert successful:', result.rows[0]);
        await client.query('COMMIT');
        return res.status(201).json(result.rows[0]);
      } catch (insertError) {
        console.error('Insert error:', {
          code: insertError.code,
          message: insertError.message,
          detail: insertError.detail
        });
        throw new Error(`Failed to insert goal: ${insertError.message}`);
      }
    } catch (error) {
      console.error('Top level error:', error);
      await client.query('ROLLBACK');
      return res.status(400).json({
        errors: [{
          msg: 'Failed to create goal',
          error: error.message,
          details: error.stack
        }]
      });
    } finally {
      client.release();
    }
  },

  // Update goal
  async updateGoal(req, res) {
    try {
      const userId = req.user.id;
      const goalId = req.params.id;
      const { type, ...goalData } = req.body;

      const query = `
        UPDATE goals 
        SET type = $1, data = $2
        WHERE id = $3 AND user_id = $4
        RETURNING *
      `;

      const values = [type, goalData, goalId, userId];
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      res.json(rows[0]);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  },

  // Delete goal
  async deleteGoal(req, res) {
    try {
      const userId = req.user.id;
      const goalId = req.params.id;

      const query = `
        DELETE FROM goals 
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;

      const { rows } = await pool.query(query, [goalId, userId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
      handleDatabaseError(error, res);
    }
  }
};

module.exports = goalController; 