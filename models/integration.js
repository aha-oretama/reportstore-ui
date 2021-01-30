'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Integration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   Integration.hasMany(models.report);
    // }
  }
  Integration.init(
    {
      repository_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      token: DataTypes.BLOB,
    },
    {
      sequelize,
      modelName: 'integration',
      underscored: true,
    }
  );
  return Integration;
};
