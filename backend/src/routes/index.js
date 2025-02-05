const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth');
const testRoutes = require('./test');
const runRoutes = require('./runs');
const workoutRoutes = require('./workouts');
const goalRoutes = require('./goals');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/test', testRoutes);
router.use('/runs', runRoutes);
router.use('/workouts', workoutRoutes);
router.use('/goals', goalRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = router; 