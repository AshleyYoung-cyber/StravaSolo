const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');
const auth = require('../middleware/auth');
const { runValidationRules, runIdValidation } = require('../middleware/runValidation');

// All run routes require authentication
router.use(auth);

// Get all runs
router.get('/', runController.getAllRuns);

// Get single run
router.get('/:id', runIdValidation, runController.getRun);

// Create new run
router.post('/', runValidationRules, runController.createRun);

// Update run
router.put('/:id', [...runIdValidation, ...runValidationRules], runController.updateRun);

// Delete run
router.delete('/:id', runIdValidation, runController.deleteRun);

module.exports = router; 