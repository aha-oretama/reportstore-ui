'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Suite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // Suite.hasMany(models.Testcase);
    //   // Suite.belongsTo(models.Report);
    // }
  }

  Suite.init({
    report_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    tests: DataTypes.INTEGER,
    failures: DataTypes.INTEGER,
    errors: DataTypes.INTEGER,
    skipped: DataTypes.INTEGER,
    time: DataTypes.REAL,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'suite',
    underscored: true,
  });
  return Suite;
};
