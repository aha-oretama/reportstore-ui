'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Testcase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // Testcase.belongsTo(models.Suite)
    // }
  }

  Testcase.init(
    {
      suite_id: DataTypes.INTEGER,
      classname: DataTypes.STRING,
      name: DataTypes.STRING,
      failure: DataTypes.STRING,
      skipped: DataTypes.STRING,
      time: DataTypes.REAL,
    },
    {
      sequelize,
      modelName: 'testcase',
      underscored: true,
    }
  );
  return Testcase;
};
