'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      repository_id: {
        allowNull: true,
        references: {
          model: 'integrations',
          key: 'repository_id',
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
      time: {
        allowNull: false,
        type: Sequelize.REAL,
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
    await queryInterface.dropTable('reports');
  },
};
