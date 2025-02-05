const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Goal = sequelize.define('Goal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('DISTANCE', 'FREQUENCY', 'PACE', 'TIME'),
      allowNull: false
    },
    target: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeframe: {
      type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'),
      allowNull: false,
      defaultValue: 'NOT_STARTED'
    }
  });

  return Goal;
}; 