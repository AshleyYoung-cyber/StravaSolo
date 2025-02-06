const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'abbielove',
  host: process.env.DB_HOST || 'localhost',
  database: 'solostrava',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Check and create tables if they don't exist
async function initializeDatabase() {
  try {
    // Check if goals table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'goals'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Creating goals table...');
      await pool.query(`
        CREATE TABLE goals (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          type VARCHAR(50) NOT NULL,
          data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Goals table created successfully');
    } else {
      console.log('Goals table already exists');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// Initialize database on startup
initializeDatabase();

module.exports = pool; 