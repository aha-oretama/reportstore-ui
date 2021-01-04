'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('suites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      report_id: {
        allowNull: false,
        references: {
          model: 'reports',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      tests: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      failures: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      errors: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      skipped: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      time: {
        allowNull: false,
        type: Sequelize.REAL,
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('suites');
  },
};
