const handleDatabaseError = (error, res) => {
  console.error('Database error:', error);
  
  if (error.code === '23505') { // Unique violation
    return res.status(409).json({
      message: 'Resource already exists'
    });
  }
  
  if (error.code === '23503') { // Foreign key violation
    return res.status(400).json({
      message: 'Referenced resource does not exist'
    });
  }
  
  // Default error response
  return res.status(500).json({
    message: 'Internal server error'
  });
};

module.exports = {
  handleDatabaseError
}; 