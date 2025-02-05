const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Run = sequelize.define('Run', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    distance: {
      type: DataTypes.INTEGER, // in meters
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    averagePace: {
      type: DataTypes.INTEGER, // seconds per km
      allowNull: false
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return Run;
}; 