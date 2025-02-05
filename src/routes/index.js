const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');

router.use('/users', userRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = router; 