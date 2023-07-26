'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add multiple new columns to the table
    await queryInterface.addColumn('customers', 'address_1', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('customers', 'address_2', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('customers', 'city', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('customers', 'state', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('customers', 'postal_code', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    // Add more columns as needed
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the added columns in reverse order in the down function
    await queryInterface.removeColumn('customers', 'address_1');
    await queryInterface.removeColumn('customers', 'address_2');
    await queryInterface.removeColumn('customers', 'city');
    await queryInterface.removeColumn('customers', 'state');
    await queryInterface.removeColumn('customers', 'postal_code');

    // Remove more columns as needed for rollback
  },
};