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

// Validation rules for creating/updating runs
const runValidationRules = [
  body('distance')
    .isInt({ min: 1 })
    .withMessage('Distance must be a positive number in meters'),
  
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number in seconds'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  
  body('averagePace')
    .isInt({ min: 1 })
    .withMessage('Average pace must be a positive number in seconds per km'),
  
  body('calories')
    .isInt({ min: 0 })
    .withMessage('Calories must be a non-negative number'),
  
  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  
  validateRequest
];

// Validation rules for run ID parameter
const runIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Run ID must be a positive integer'),
  
  validateRequest
];

module.exports = {
  runValidationRules,
  runIdValidation
}; 