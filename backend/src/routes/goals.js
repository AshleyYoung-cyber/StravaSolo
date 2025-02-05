const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');
const { goalValidationRules, goalIdValidation } = require('../middleware/goalValidation');

// All goal routes require authentication
router.use(auth);

// Get all goals
router.get('/', goalController.getAllGoals);

// Get single goal
router.get('/:id', goalIdValidation, goalController.getGoal);

// Create new goal
router.post('/', goalValidationRules, goalController.createGoal);

// Update goal
router.put('/:id', [...goalIdValidation, ...goalValidationRules], goalController.updateGoal);

// Delete goal
router.delete('/:id', goalIdValidation, goalController.deleteGoal);

module.exports = router; 