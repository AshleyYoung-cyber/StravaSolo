const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { authenticateToken } = require('../middleware/auth');

router.get('/active', authenticateToken, goalController.getActiveGoals);
router.get('/', authenticateToken, goalController.getAllGoals);
router.post('/', authenticateToken, goalController.createGoal);
router.delete('/:id', authenticateToken, goalController.deleteGoal);

router.get('/goals', async (req, res) => {
  const { status } = req.query;
  if (status === 'active') {
    // Handle active goals query
    try {
      const activeGoals = await goalController.getActiveGoals(req.user.id);
      res.json(activeGoals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle regular goals list
    try {
      const goals = await goalController.getAllGoals(req.user.id);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router; 