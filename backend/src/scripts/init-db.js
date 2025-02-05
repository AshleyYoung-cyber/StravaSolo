require('dotenv').config();
const { sequelize } = require('../models');

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

initDatabase(); 