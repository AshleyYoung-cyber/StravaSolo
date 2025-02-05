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

// Validation rules for creating/updating goals
const goalValidationRules = [
  body('type')
    .isIn(['DISTANCE', 'TIME', 'PACE'])
    .withMessage('Type must be one of: DISTANCE, TIME, PACE'),
  
  body('target')
    .isString()
    .notEmpty()
    .withMessage('Target is required'),
  
  body('timeframe')
    .isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
    .withMessage('Timeframe must be one of: DAILY, WEEKLY, MONTHLY, YEARLY'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  body('status')
    .optional()
    .isIn(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED'])
    .withMessage('Status must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED, ABANDONED'),
  
  validateRequest
];

// Validation rules for goal ID parameter
const goalIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Goal ID must be a positive integer'),
  
  validateRequest
];

module.exports = {
  goalValidationRules,
  goalIdValidation
}; 