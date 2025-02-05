const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Run extends Model {}

  Run.init({
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
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE
    },
    distance: {
      type: DataTypes.FLOAT
    },
    duration: {
      type: DataTypes.INTEGER
    },
    pace: {
      type: DataTypes.FLOAT
    },
    route: {
      type: DataTypes.JSONB
    },
    elevation: {
      type: DataTypes.JSONB
    },
    weatherData: {
      type: DataTypes.JSONB
    },
    stats: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'Run',
    timestamps: true
  });

  return Run;
}; 