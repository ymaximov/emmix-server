'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('customers', 'country', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // Add more columns as needed
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the added columns in reverse order in the down function
    await queryInterface.removeColumn('customers', 'country');

    // Remove more columns as needed for rollback
  },
};