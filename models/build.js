'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Build extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   Build.belongsTo(models.report);
    // }
  }
  Build.init(
    {
      report_id: DataTypes.INTEGER,
      repository_url: DataTypes.STRING,
      branch: DataTypes.STRING,
      commit_hash: DataTypes.STRING,
      tag: DataTypes.STRING,
      pull_request_url: DataTypes.STRING,
      build_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'build',
      underscored: true,
    }
  );
  return Build;
};
