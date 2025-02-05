const { Sequelize } = require('sequelize');
const config = require('../config/database.js')[process.env.NODE_ENV || 'development'];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Import all models
const User = require('./user')(sequelize);
const Run = require('./run')(sequelize);
const Workout = require('./workout')(sequelize);
const Goal = require('./goal')(sequelize);

// Set up associations
User.hasMany(Run);
Run.belongsTo(User);

User.hasMany(Workout);
Workout.belongsTo(User);

User.hasMany(Goal);
Goal.belongsTo(User);

const db = {
  sequelize,
  Sequelize,
  User,
  Run,
  Workout,
  Goal
};

module.exports = db; 