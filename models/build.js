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
    //   // define association here
    // }
  }
  Build.init(
    {
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
