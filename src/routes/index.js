const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth');
const testRoutes = require('./test');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/test', testRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = router; 