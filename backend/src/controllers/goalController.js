const { Goal } = require('../models');

const goalController = {
  // Get all goals for logged in user
  async getAllGoals(req, res) {
    try {
      console.log('Fetching goals for user:', req.user.id);
      
      const goals = await Goal.findAll({
        where: { UserId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      
      console.log('Goals found:', goals);
      res.json(goals);
    } catch (error) {
      console.error('Detailed error fetching goals:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Error fetching goals', 
        details: error.message,
        stack: error.stack 
      });
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
      const { 
        name, 
        description, 
        type,
        target,
        timeframe,
        startDate,
        endDate,
        targetDate, 
        targetDistance, 
        targetTime, 
        status 
      } = req.body;
      
      console.log('Creating goal with data:', req.body);
      
      const goal = await Goal.create({
        UserId: req.user.id,
        name,
        description,
        type,
        target,
        timeframe,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetDate: new Date(targetDate),
        targetDistance,
        targetTime,
        status: status || 'IN_PROGRESS'
      });
      
      console.log('Goal created:', goal);
      res.status(201).json(goal);
    } catch (error) {
      console.error('Detailed error creating goal:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Error creating goal', details: error.message });
    }
  },

  // Update goal
  async updateGoal(req, res) {
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
      
      const { name, description, targetDate, targetDistance, targetTime, status } = req.body;
      
      await goal.update({
        name: name || goal.name,
        description: description || goal.description,
        targetDate: targetDate || goal.targetDate,
        targetDistance: targetDistance || goal.targetDistance,
        targetTime: targetTime || goal.targetTime,
        status: status || goal.status
      });
      
      res.json(goal);
    } catch (error) {
      console.error('Error updating goal:', error);
      res.status(500).json({ error: 'Error updating goal' });
    }
  },

  // Delete goal
  async deleteGoal(req, res) {
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
      
      await goal.destroy();
      res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
      console.error('Error deleting goal:', error);
      res.status(500).json({ error: 'Error deleting goal' });
    }
  }
};

module.exports = goalController; 