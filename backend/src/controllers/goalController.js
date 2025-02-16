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
      const query = `
        SELECT id, type, data, completed
        FROM goals
        WHERE user_id = $1
        ORDER BY (data->>'end_date')::date DESC
      `;
      
      const result = await pool.query(query, [req.user.id]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching goals:', error);
      res.status(500).json({ error: error.message });
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
    try {
      console.log('=== CREATE GOAL DEBUG ===');
      console.log('Request body:', req.body);
      
      const query = `
        INSERT INTO goals (
          user_id,
          type,
          data,
          completed
        )
        VALUES (
          $1,
          'distance',
          $2::jsonb,
          false
        )
        RETURNING id, type, data, completed
      `;

      // Map the incoming fields to the expected structure
      const goalData = {
        target_distance: parseFloat(req.body.target),
        distance_unit: req.body.unit,
        start_date: req.body.startDate,
        end_date: req.body.endDate,
        current_distance: 0
      };

      console.log('Goal data to insert:', goalData);
      
      const result = await pool.query(query, [req.user.id, goalData]);
      console.log('Created goal:', result.rows[0]);
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating goal:', error);
      res.status(400).json({ error: error.message });
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
    console.log('=== DELETE GOAL DEBUG ===');
    console.log('req.params.id:', req.params.id);
    console.log('req.user.id:', req.user.id);
    console.log('req.user:', req.user);
    
    try {
      const { id } = req.params;
      
      const query = `
        DELETE FROM goals 
        WHERE id = $1 AND user_id = $2 
        RETURNING *
      `;
      
      const result = await pool.query(query, [id, req.user.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Goal not found' });
      }
      
      res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
      console.error('Error deleting goal:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getActiveGoals(req, res) {
    try {
      console.log('=== GET ACTIVE GOALS DEBUG ===');
      console.log('User ID:', req.user.id);
      
      const query = `
        SELECT id, type, data, completed
        FROM goals
        WHERE user_id = $1
          AND type = 'distance'
          AND (data->>'start_date')::date <= CURRENT_DATE
          AND (data->>'end_date')::date >= CURRENT_DATE
        ORDER BY (data->>'end_date')::date ASC
      `;
      
      const result = await pool.query(query, [req.user.id]);
      console.log('Active goals found:', result.rows);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching active goals:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = goalController; 