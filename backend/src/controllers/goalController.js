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
      console.log('Received request body:', req.body);
      console.log('User ID:', req.user.id);
      
      await client.query('BEGIN');
      
      // Separate type from the rest of the data
      const { type, ...restData } = req.body;

      const result = await client.query(
        'INSERT INTO goals (user_id, type, data) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, type, restData]
      );

      await client.query('COMMIT');
      res.status(201).json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createGoal:', error);
      res.status(400).json({
        errors: [{
          msg: error.message,
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
    const client = await pool.connect();
    try {
      const goalId = req.params.id;
      const userId = req.user.id;

      console.log('Attempting to delete goal:', { goalId, userId });

      await client.query('BEGIN');

      // First check if the goal exists and belongs to the user
      const checkResult = await client.query(
        'SELECT * FROM goals WHERE id = $1 AND user_id = $2',
        [goalId, userId]
      );

      if (checkResult.rows.length === 0) {
        throw new Error('Goal not found or unauthorized');
      }

      // Delete the goal
      const result = await client.query(
        'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING *',
        [goalId, userId]
      );

      await client.query('COMMIT');
      
      console.log('Goal deleted successfully');
      res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in deleteGoal:', error);
      res.status(error.message === 'Goal not found or unauthorized' ? 404 : 400).json({
        errors: [{
          msg: error.message
        }]
      });
    } finally {
      client.release();
    }
  }
};

module.exports = goalController; 