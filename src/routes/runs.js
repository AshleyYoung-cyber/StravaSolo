const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');
const auth = require('../middleware/auth');

// All run routes require authentication
router.use(auth);

// Get all runs
router.get('/', runController.getAllRuns);

// Get single run
router.get('/:id', runController.getRun);

// Create new run
router.post('/', runController.createRun);

// Update run
router.put('/:id', runController.updateRun);

// Delete run
router.delete('/:id', runController.deleteRun);

module.exports = router; 