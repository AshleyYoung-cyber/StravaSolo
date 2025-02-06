const express = require('express');
const router = express.Router();
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const goalController = require('../controllers/goalController');
const { authenticateToken } = require('../middleware/auth');
const { goalValidationRules, goalIdValidation } = require('../middleware/goalValidation');

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS to all routes
router.use(cors(corsOptions));
router.use(express.json());

// Handle preflight requests explicitly
router.options('*', cors(corsOptions));

// Apply auth middleware to all routes
router.use(authenticateToken);

// Simplified validation middleware
const validateGoal = [
  body('type')
    .isString()
    .isIn(['DISTANCE', 'TIME', 'PACE'])
    .withMessage('Type must be one of: DISTANCE, TIME, PACE'),
  
  // Simplified target validation
  body('target')
    .isNumeric()
    .withMessage('Target must be a number'),
  
  body('timeframe')
    .isString()
    .isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
    .withMessage('Timeframe must be one of: DAILY, WEEKLY, MONTHLY, YEARLY'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

// Add error handling middleware
router.use((err, req, res, next) => {
  console.error('Goals route error:', err);
  res.status(400).json({ 
    message: 'Invalid request',
    error: err.message 
  });
});

// Get all goals
router.get('/', goalController.getAllGoals);

// Get single goal
router.get('/:id', goalIdValidation, goalController.getGoal);

// Create new goal
router.post('/', (req, res, next) => {
  const data = req.body;
  console.log('Processing RACE goal:', JSON.stringify(data, null, 2));

  if (data.type === 'RACE') {
    // Simplified validation
    const required = {
      name: data.name,
      date: data.date,
      location: data.location,
      distance: data.distance,
      raceType: data.raceType
    };

    console.log('Checking required fields:', required);

    const missing = Object.entries(required)
      .filter(([_, value]) => value == null)
      .map(([key]) => key);

    if (missing.length > 0) {
      console.log('Missing fields:', missing);
      return res.status(400).json({
        errors: [{
          msg: `Missing required fields: ${missing.join(', ')}`,
          missing,
          received: data
        }]
      });
    }

    // All validations passed
    console.log('Validation passed, proceeding to create goal');
    return next();
  }

  // Handle other goal types
  next();
}, goalController.createGoal);

// Update goal
router.put('/:id', goalController.updateGoal);

// Delete goal
router.delete('/:id', goalIdValidation, goalController.deleteGoal);

module.exports = router; 