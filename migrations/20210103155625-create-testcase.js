'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('testcases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      suite_id: {
        allowNull: false,
        references: {
          model: "suites",
          key: "id"
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        type: Sequelize.INTEGER
      },
      classname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      failure: {
        allowNull: true,
        type: Sequelize.STRING
      },
      skipped: {
        allowNull: true,
        type: Sequelize.STRING
      },
      time: {
        allowNull: false,
        type: Sequelize.REAL
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
    await queryInterface.dropTable('testcases');
  }
};
