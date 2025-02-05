const { Workout } = require('../models');

const workoutController = {
  // Get all workouts for logged in user
  async getAllWorkouts(req, res) {
    try {
      const workouts = await Workout.findAll({
        where: { UserId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      res.json(workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      res.status(500).json({ error: 'Error fetching workouts' });
    }
  },

  // Get single workout
  async getWorkout(req, res) {
    try {
      const workout = await Workout.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id
        }
      });
      
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      res.json(workout);
    } catch (error) {
      console.error('Error fetching workout:', error);
      res.status(500).json({ error: 'Error fetching workout' });
    }
  },

  // Create new workout
  async createWorkout(req, res) {
    try {
      const { name, description, type, plannedDistance } = req.body;
      
      const workout = await Workout.create({
        UserId: req.user.id,
        name,
        description,
        type,
        plannedDistance
      });
      
      res.status(201).json(workout);
    } catch (error) {
      console.error('Error creating workout:', error);
      res.status(500).json({ error: 'Error creating workout' });
    }
  },

  // Update workout
  async updateWorkout(req, res) {
    try {
      const workout = await Workout.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id
        }
      });
      
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      const { name, description, type, plannedDistance } = req.body;
      
      await workout.update({
        name: name || workout.name,
        description: description || workout.description,
        type: type || workout.type,
        plannedDistance: plannedDistance || workout.plannedDistance
      });
      
      res.json(workout);
    } catch (error) {
      console.error('Error updating workout:', error);
      res.status(500).json({ error: 'Error updating workout' });
    }
  },

  // Delete workout
  async deleteWorkout(req, res) {
    try {
      const workout = await Workout.findOne({
        where: { 
          id: req.params.id,
          UserId: req.user.id
        }
      });
      
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      await workout.destroy();
      res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
      console.error('Error deleting workout:', error);
      res.status(500).json({ error: 'Error deleting workout' });
    }
  }
};

module.exports = workoutController; 