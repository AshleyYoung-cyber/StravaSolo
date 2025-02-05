const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Workout extends Model {}

  Workout.init({
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('interval', 'tempo', 'distance', 'time'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    plan: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Workout',
    timestamps: true
  });

  return Workout;
}; 