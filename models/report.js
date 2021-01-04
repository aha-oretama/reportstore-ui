'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Report.hasMany(models.suite)
    }
  }

  Report.init(
    {
      name: DataTypes.STRING,
      tests: DataTypes.INTEGER,
      failures: DataTypes.INTEGER,
      errors: DataTypes.INTEGER,
      time: DataTypes.REAL,
    },
    {
      sequelize,
      modelName: 'report',
      underscored: true,
    }
  );
  return Report;
};
