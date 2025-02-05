const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Goal extends Model {}

  Goal.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('distance', 'pace', 'frequency'),
      allowNull: false
    },
    target: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    timeframe: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'custom'),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE
    },
    progress: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'failed'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Goal',
    timestamps: true
  });

  return Goal;
}; 