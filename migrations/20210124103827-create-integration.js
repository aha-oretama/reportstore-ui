'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')

    await queryInterface.createTable('integrations', {
      repository_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('integrations');
    await queryInterface.sequelize.query("DROP EXTENSION IF EXISTS pgcrypto CASCADE;")
  }
};
