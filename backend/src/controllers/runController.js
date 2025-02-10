const pool = require('../db');

const runController = {
  // Get all runs for logged in user
  async getAllRuns(req, res) {
    try {
      const query = `
        SELECT 
          id,
          distance,
          distance_unit::text as distance_unit,
          EXTRACT(EPOCH FROM duration)::integer as duration,
          date,
          type,
          location,
          notes,
          created_at,
          updated_at
        FROM runs 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query, [req.user.id]);
      console.log('getAllRuns result:', JSON.stringify(result.rows[0], null, 2));
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching runs:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get single run
  async getRun(req, res) {
    try {
      const query = `
        SELECT 
          id,
          distance,
          distance_unit::text as distance_unit,
          EXTRACT(EPOCH FROM duration)::integer as duration,
          date,
          type,
          location,
          notes,
          created_at,
          updated_at
        FROM runs 
        WHERE id = $1 AND user_id = $2
      `;

      const result = await pool.query(query, [req.params.id, req.user.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Run not found' });
      }

      console.log('getRun result:', JSON.stringify(result.rows[0], null, 2));
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching run:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Create new run
  async createRun(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const { distance, duration, date, type, location, notes, distance_unit } = req.body;
      
      // First insert the run
      const runQuery = `
        INSERT INTO runs (
          user_id,
          distance,
          duration,
          date,
          type,
          location,
          notes,
          distance_unit
        )
        VALUES (
          $1, $2, $3::interval, $4, $5, $6, $7, 
          $8::distance_unit_type
        )
        RETURNING 
          id,
          distance,
          distance_unit::text as distance_unit,
          EXTRACT(EPOCH FROM duration)::integer as duration,
          date,
          type,
          location,
          notes,
          created_at,
          updated_at
      `;

      const runResult = await client.query(runQuery, [
        req.user.id,
        distance,
        `${duration} seconds`,
        date,
        type,
        location,
        notes,
        distance_unit
      ]);

      // Fetch active goals for the user
      const goalsQuery = `
        SELECT 
          id,
          target_distance,
          distance_unit::text as distance_unit,
          start_date,
          end_date,
          current_distance
        FROM goals 
        WHERE user_id = $1 
          AND start_date <= $2 
          AND end_date >= $2
          AND completed = false`;
      
      const goalsResult = await client.query(goalsQuery, [req.user.id, date]);
      
      // Update goals if necessary
      for (const goal of goalsResult.rows) {
        if (goal.distance_unit === distance_unit) {
          // Units match, add distance directly
          const newDistance = goal.current_distance + distance;
          
          await client.query(
            `UPDATE goals 
             SET current_distance = $1,
                 completed = CASE WHEN $1 >= target_distance THEN true ELSE false END
             WHERE id = $2`,
            [newDistance, goal.id]
          );
        } else {
          // Units don't match, convert before adding
          const convertedDistance = distance_unit === 'km' 
            ? distance * 0.621371  // km to miles
            : distance * 1.60934;  // miles to km
            
          const newDistance = goal.current_distance + convertedDistance;
          
          await client.query(
            `UPDATE goals 
             SET current_distance = $1,
                 completed = CASE WHEN $1 >= target_distance THEN true ELSE false END
             WHERE id = $2`,
            [newDistance, goal.id]
          );
        }
      }

      await client.query('COMMIT');
      
      console.log('Run created and goals updated:', JSON.stringify(runResult.rows[0], null, 2));
      res.status(201).json(runResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createRun:', error);
      res.status(400).json({ error: error.message });
    } finally {
      client.release();
    }
  },

  // Update run
  async updateRun(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const { distance, duration, date, type, location, notes } = req.body;
      
      const result = await client.query(
        `UPDATE runs 
         SET distance = COALESCE($1, distance),
             duration = COALESCE($2, duration),
             date = COALESCE($3, date),
             type = COALESCE($4, type),
             location = COALESCE($5, location),
             notes = COALESCE($6, notes)
         WHERE id = $7 AND user_id = $8
         RETURNING *`,
        [distance, duration, date, type, location, notes, req.params.id, req.user.id]
      );

      if (result.rows.length === 0) {
        throw new Error('Run not found');
      }

      await client.query('COMMIT');
      res.json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating run:', error);
      res.status(error.message === 'Run not found' ? 404 : 500)
        .json({ error: error.message });
    } finally {
      client.release();
    }
  },

  // Delete run
  async deleteRun(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        'DELETE FROM runs WHERE id = $1 AND user_id = $2 RETURNING *',
        [req.params.id, req.user.id]
      );

      if (result.rows.length === 0) {
        throw new Error('Run not found');
      }

      await client.query('COMMIT');
      res.json({ message: 'Run deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting run:', error);
      res.status(error.message === 'Run not found' ? 404 : 500)
        .json({ error: error.message });
    } finally {
      client.release();
    }
  }
};

module.exports = runController; 