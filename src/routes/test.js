const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Protected test route
router.get('/protected', auth, (req, res) => {
  res.json({ 
    message: 'You accessed a protected route!',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

module.exports = router; 