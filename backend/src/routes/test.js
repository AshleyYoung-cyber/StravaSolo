const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');

console.log('Test routes being registered...');

// Protected test route
router.get('/protected', (req, res) => {
  console.log('Protected route accessed');
  res.json({ message: 'You accessed a protected route!' });
});

router.get('/test-db', async function(req, res) {
  console.log('Test DB route accessed');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database test query result:', result);
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Add a test route specifically for the runs table
router.get('/test-runs', async function(req, res) {
  console.log('Test runs route accessed');
  try {
    const result = await pool.query('SELECT * FROM runs LIMIT 1');
    console.log('Runs table test result:', result);
    res.json({ 
      success: true, 
      message: 'Runs table accessible',
      data: result.rows
    });
  } catch (error) {
    console.error('Runs table test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router; 