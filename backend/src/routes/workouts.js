const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const auth = require('../middleware/auth');
const { workoutValidationRules, workoutIdValidation } = require('../middleware/workoutValidation');

// All workout routes require authentication
router.use(auth);

// Get all workouts
router.get('/', workoutController.getAllWorkouts);

// Get single workout
router.get('/:id', workoutIdValidation, workoutController.getWorkout);

// Create new workout
router.post('/', workoutValidationRules, workoutController.createWorkout);

// Update workout
router.put('/:id', [...workoutIdValidation, ...workoutValidationRules], workoutController.updateWorkout);

// Delete workout
router.delete('/:id', workoutIdValidation, workoutController.deleteWorkout);

module.exports = router; 