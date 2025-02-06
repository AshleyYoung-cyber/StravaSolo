const express = require('express');
const cors = require('cors');
const goalsRouter = require('./routes/goals');
const authRouter = require('./routes/auth');

const app = express();

// Configure CORS before any routes
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/goals', goalsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app; 