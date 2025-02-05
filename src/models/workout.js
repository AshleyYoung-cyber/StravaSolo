const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Workout = sequelize.define('Workout', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('INTERVAL', 'STEADY', 'TEMPO', 'FARTLEK'),
      allowNull: false
    },
    plannedDistance: {
      type: DataTypes.INTEGER, // in meters
      allowNull: true
    }
  });

  return Workout;
}; 