'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('builds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      repository_url: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      branch: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      commit_hash: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      tag: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      pull_request_url: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      build_url: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('builds');
  },
};
