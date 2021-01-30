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
      Report.hasMany(models.suite);
      Report.hasOne(models.build);
      // Report.belongsTo(models.integration, {foreignKey: 'repository_id', targetKey: 'repository_id'});
    }
  }

  Report.init(
    {
      repository_id: DataTypes.INTEGER,
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
