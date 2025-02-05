const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');

// Middleware to check for validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for creating/updating workouts
const workoutValidationRules = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('type')
    .isIn(['INTERVAL', 'STEADY', 'TEMPO', 'FARTLEK'])
    .withMessage('Type must be one of: INTERVAL, STEADY, TEMPO, FARTLEK'),
  
  body('plannedDistance')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Planned distance must be a positive number in meters'),
  
  validateRequest
];

// Validation rules for workout ID parameter
const workoutIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Workout ID must be a positive integer'),
  
  validateRequest
];

module.exports = {
  workoutValidationRules,
  workoutIdValidation
}; 