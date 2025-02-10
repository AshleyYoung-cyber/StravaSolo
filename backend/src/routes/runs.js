const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');
const { authenticateToken } = require('../middleware/auth');
const { runValidationRules, runIdValidation } = require('../middleware/runValidation');

// Apply auth middleware to all routes
router.use(authenticateToken);

// Create a new run
router.post('/', runValidationRules, runController.createRun);

// Get all runs for the authenticated user
router.get('/', runController.getAllRuns);

// Get a specific run
router.get('/:id', runIdValidation, runController.getRun);

// Update a run
router.put('/:id', runValidationRules, runController.updateRun);

// Delete a run
router.delete('/:id', runIdValidation, runController.deleteRun);

module.exports = router; 